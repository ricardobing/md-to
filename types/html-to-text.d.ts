declare module 'html-to-text' {
  export interface HtmlToTextOptions {
    wordwrap?: number | false
    selectors?: Array<{
      selector: string
      options?: any
    }>
    [key: string]: any
  }

  export function convert(html: string, options?: HtmlToTextOptions): string
}
