import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Comments({
      provider: 'giscus',
      options: {
        repo: `justintimber949/notepreclinic`
        repoId: 'R_kgDOOqrT_w'
        category: "Announcements"
        categoryId: "DIC_kwDOOqrT_84CqMEy"
     
        // Url to folder with custom themes
        // defaults to 'https://${cfg.baseUrl}/static/giscus'
        themeUrl?: https://${cfg.baseUrl}/static/giscus
     
        // filename for light theme .css file
        // defaults to 'light'
        lightTheme?: string
     
        // filename for dark theme .css file
        // defaults to 'dark'
        darkTheme?: string
     
        // how to map pages -> discussions
        // defaults to 'url'
        mapping?: "pathname"
     
        // use strict title matching
        // defaults to true
        strict?: boolean
     
        // whether to enable reactions for the main post
        // defaults to true
        reactionsEnabled?: boolean
     
        // where to put the comment input box relative to the comments
        // defaults to 'bottom'
        inputPosition?: "bottom"
      }
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
