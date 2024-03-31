let eventGuid = 0
    // let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [{
        id: createEventId(),
        title: "a",
        start: "2024-03-01",
        end: "2024-03-31",
        allDay: false,
        group_id: "text",
        is_holiday: "boolean",
        shift_type: "string",
        holiday_desc: null
    },
    {
        id: createEventId(),
        title: "a",
        start: "2024-02-28",
        end: "2024-02-29",
        allDay: false,
        group_id: "text",
        is_holiday: "boolean",
        shift_type: "string",
        holiday_desc: null
    }
]

export function createEventId() {
    return String(eventGuid++)
}
