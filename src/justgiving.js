import { useEffect, useRef, useState } from 'react'
import { JUSTGIVING_APP_ID, JUSTGIVING_PAGE } from './fundraiser.config'

const API_BASE = 'https://api.justgiving.com'
const MAX_PAGE_SIZE = 150 // JustGiving's upper limit for donation pages

async function jgFetch(path) {
  if (!JUSTGIVING_APP_ID) throw new Error('JustGiving app ID is not configured')
  const res = await fetch(`${API_BASE}/${JUSTGIVING_APP_ID}/v1${path}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`JustGiving request failed: ${res.status}`)
  return res.json()
}

// JustGiving returns WCF-style dates, e.g. "/Date(1556284320000+0000)/"
function parseJgDate(value) {
  const match = /\/Date\((-?\d+)/.exec(value || '')
  return match ? Number(match[1]) : Date.parse(value) || 0
}

function toNumber(value) {
  const n = parseFloat(value)
  return Number.isFinite(n) ? n : null
}

async function fetchPageTotals(page) {
  const data = await jgFetch(`/fundraising/pages/${encodeURIComponent(page)}`)
  return {
    raised: toNumber(data.grandTotalRaisedExcludingGiftAid) ?? 0,
    target: toNumber(data.fundraisingTarget) ?? 0,
    currencyCode: data.currencyCode || 'GBP',
  }
}

async function fetchDonationPage(page, pageNum, pageSize) {
  const data = await jgFetch(
    `/fundraising/pages/${encodeURIComponent(page)}/donations?pageNum=${pageNum}&pageSize=${pageSize}`
  )
  const donations = (data.donations || []).map((d) => ({
    id: d.id,
    name: d.donorDisplayName?.trim() || 'Anonymous',
    // amount is null when the donor chose to hide it
    amount: toNumber(d.amount),
    message: d.message?.trim() || '',
    date: parseJgDate(d.donationDate),
  }))
  return { donations, totalPages: data.pagination?.totalPages ?? 1 }
}

export function formatMoney(amount, currencyCode) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currencyCode }).format(amount)
}

/**
 * Polls JustGiving for a fundraising page's totals and donations.
 *
 * Donations are newest first. With allDonations the full history is loaded
 * once, then later polls only fetch pages until they reach a donation we
 * already have, so the leaderboard stays cheap to keep up to date.
 */
export function useFundraiser({ page, intervalMs, donations: wantDonations = false, allDonations = false, pageSize = 25 }) {
  const [totals, setTotals] = useState(null)
  const [donations, setDonations] = useState([])
  const [error, setError] = useState(null)
  const known = useRef(new Map())

  useEffect(() => {
    let cancelled = false
    known.current = new Map()

    async function loadDonations() {
      const size = allDonations ? MAX_PAGE_SIZE : Math.min(pageSize, MAX_PAGE_SIZE)
      for (let pageNum = 1; ; pageNum++) {
        const { donations: batch, totalPages } = await fetchDonationPage(page, pageNum, size)
        const reachedKnown = batch.some((d) => known.current.has(d.id))
        batch.forEach((d) => known.current.set(d.id, d))
        if (!allDonations || reachedKnown || pageNum >= totalPages) break
      }
      return [...known.current.values()].sort((a, b) => b.date - a.date)
    }

    async function load() {
      try {
        const [nextTotals, nextDonations] = await Promise.all([
          fetchPageTotals(page),
          wantDonations ? loadDonations() : null,
        ])
        if (cancelled) return
        setTotals(nextTotals)
        if (nextDonations) setDonations(nextDonations)
        setError(null)
      } catch (err) {
        console.error(err)
        if (!cancelled) setError(err.message)
      }
    }

    if (!page) return
    load()
    const timer = setInterval(load, intervalMs)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [page, intervalMs, wantDonations, allDonations, pageSize])

  return { totals, donations, error: page ? error : 'JustGiving page is not configured' }
}

/** Reads the shared overlay options from the query string. */
export function useOverlayOptions() {
  const params = new URLSearchParams(window.location.search)
  const intNum = (key, fallback, min, max) => {
    const n = parseInt(params.get(key), 10)
    return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : fallback
  }
  return {
    page: params.get('page') || JUSTGIVING_PAGE,
    intervalMs: intNum('interval', 30, 10, 3600) * 1000,
    limit: intNum('limit', 5, 1, 50),
    showMessages: params.get('messages') === '1',
    color: /^[0-9a-f]{3,8}$/i.test(params.get('color') || '') ? `#${params.get('color')}` : null,
  }
}

/** Makes the page background transparent so OBS can composite it over video. */
export function useTransparentBackground() {
  useEffect(() => {
    document.documentElement.classList.add('overlay')
    return () => document.documentElement.classList.remove('overlay')
  }, [])
}
