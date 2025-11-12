declare module 'frappe-gantt' {
  interface GanttTask {
    id: string
    name: string
    start: string
    end: string
    progress?: number
    dependencies?: string
  }

  interface GanttOptions {
    view_mode?: string
    view_mode_select?: boolean
    today_button?: boolean
    bar_height?: number
    padding?: number
    date_format?: string
    popup_on?: string
    readonly?: boolean
    scroll_to?: string
  }

  class Gantt {
    constructor(element: HTMLElement, tasks: GanttTask[], options?: GanttOptions)
  }

  export default Gantt
}