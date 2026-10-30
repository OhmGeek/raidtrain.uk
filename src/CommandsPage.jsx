import SiteFooter from './SiteFooter'
import './App.css'

// Mirrors the bot's commands in RaidTrainConductor (the `commands` map in
// raidtrain-config.json, plus the steam economy and journey handlers)
const SECTIONS = [
  {
    title: 'INFO',
    commands: [
      { names: ['!commands', '!help'], summary: 'This page' },
      { names: ['!timetable'], summary: 'Schedule link' },
      { names: ['!conductor'], summary: 'About the bot' },
      { names: ['!coal', '!fuel', '!donate', '!dono'], summary: 'Donation link' },
      { names: ['!manifest', '!rmch', '!mft'], summary: 'About the charity' },
      { names: ['!ticket'], summary: 'Thanks for watching' },
    ],
  },
  {
    title: 'JOURNEY',
    commands: [
      { names: ['!nowserving'], summary: "Who's live now" },
      { names: ['!nextstop'], summary: "Who's up next" },
      { names: ['!journey'], summary: 'Trip progress' },
    ],
  },
  {
    title: 'PASSENGER WELFARE',
    commands: [
      { names: ['!hydrate', '!refreshments'], summary: 'Drink water' },
      { names: ['!mindthegap'], summary: 'Be respectful' },
    ],
  },
  {
    title: 'HYPE',
    commands: [
      { names: ['!allaboard'], summary: 'Departure call' },
      { names: ['!choochoo'], summary: 'Train emotes' },
      { names: ['!purpletrain'], summary: 'Purple hype' },
      { names: ['!yellowline'], summary: 'Chat speed warning' },
      { names: ['!honk'], summary: 'Class 37 joy' },
      { names: ['!buffet'], summary: 'Buffet car open' },
      { names: ['!thomas'], summary: 'Theme tune' },
      { names: ['!delay'], summary: 'Random delay excuse' },
      { names: ['!sleep'], summary: 'Bot never sleeps' },
    ],
  },
  {
    title: 'LOOK AFTER PETER',
    commands: [
      { names: ['!petersleep'], summary: 'Peter, sleep' },
      { names: ['!petereat'], summary: 'Peter, eat' },
      { names: ['!peterhydrate'], summary: 'Peter, drink' },
    ],
  },
  {
    title: 'STEAM GAME',
    intro: 'Chatting earns steam every 10 minutes. Balances follow you across every channel.',
    commands: [
      { names: ['!steam'], summary: 'Your balance' },
      { names: ['!stoke <amount>'], summary: 'Gamble steam' },
      { names: ['!siphon <user> <amount>'], summary: 'Steal steam' },
      { names: ['!steamleaderboard'], summary: 'Top players' },
    ],
  },
]

export default function CommandsPage() {
  return (
    <div className="train-station-container">
      <header>
        <h1>BOT COMMANDS</h1>
      </header>
      <p className="commands-intro">
        The Station Master bot joins each streamer's chat during their slot. Anyone in chat can use these
        commands.
      </p>
      {SECTIONS.map((section) => (
        <section key={section.title} className="schedule-board commands-board">
          <h2>{section.title}</h2>
          {section.intro && <p className="board-tz">{section.intro}</p>}
          {section.commands.map((c) => (
            <div key={c.names[0]} className="commands-row">
              <span className="commands-row__names">
                {c.names.map((name) => (
                  <code key={name}>{name}</code>
                ))}
              </span>
              <span className="commands-row__summary">{c.summary}</span>
            </div>
          ))}
        </section>
      ))}
      <SiteFooter />
    </div>
  )
}
