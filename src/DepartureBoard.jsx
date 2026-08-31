
// Helper function to pre-calculate absolute departure clock times for the board
const getDepartureTime = (schedules, index, trainStartTime) => {
    let accumulatedMinutes = 0
    for (let i = 0; i < index; i++) {
        accumulatedMinutes += schedules[i].durationMinutes
    }
    const departureTimestamp = trainStartTime + accumulatedMinutes * 60 * 1000
    return new Date(departureTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function DepartureBoard({ schedule, currentIndex, trainStartTime }) {
    return (
        <div className="schedule-board">
            <h2>UPCOMING DEPARTURES</h2>
            <div className="board-header">
                <span>TIME</span>
                <span>DESTINATION</span>
                <span>DURATION</span>
                <span>STATUS</span>
            </div>
            <div className="board-rows">
                {schedule.map((item, index) => {
                    // Hide completely completed blocks from previous stops
                    if (index < currentIndex) return null

                    const isCurrent = index === currentIndex
                    const departureTime = getDepartureTime(schedule, index, trainStartTime)

                    return (
                        <div key={index} className={`board-row ${isCurrent ? 'active-row' : ''}`}>
                            <span className="row-time">{departureTime}</span>
                            <span className="row-name">{item.name}</span>
                            <span className="row-duration">
                                {item.durationMinutes > 0 ? `${item.durationMinutes} MIN` : '--'}
                            </span>
                            <span className="row-status">
                                {isCurrent ? 'ALL ABOARD' : 'ON TIME'}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
};