/**
 * Central developer-authored copy. Edit strings here; components use `t(key)`.
 * Shape is `[page][section][item]`. Swap an alternate tree via `TextProvider`,
 * `createT()`, or `setActiveTextTree()` without changing `t(key)` call sites.
 */
export type TextLeaf = string

export type TextSection = {
  [item: string]: TextLeaf
}

export type TextPage = {
  [section: string]: TextSection
}

export type TextTree = {
  [page: string]: TextPage
}

export const defaultText: TextTree = {
  home: {
    header: {
      brand: 'SAMPLE COMMUNITY',
    },
    hero: {
      title: 'A sample home for a connected community',
      body: 'This placeholder site demonstrates how a small organization can share updates, introduce its work, and invite people to upcoming events.',
      cta: 'Browse sample events',
    },
    introduction: {
      title: 'Welcome',
      body: 'Use this sample section for a concise introduction. Every page is assembled from reusable modules, so a developer can adapt the structure without creating a new page component.',
      caption: 'Replace this placeholder mark with an image for your organization.',
    },
    updates: {
      title: 'Community updates',
      body: 'This placeholder announcement is replaced by rows from the public sample sheet when Google Sheets is configured.',
    },
  },
  nav: {
    chrome: {
      label: 'Primary',
      menu: 'Menu',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    items: {
      home: 'Home',
      events: 'Events',
      about: 'About',
      contact: 'Contact',
      members: 'Members',
    },
  },
  about: {
    hero: {
      title: 'About the sample community',
      body: 'A believable section landing page built entirely from reusable page modules.',
    },
    story: {
      title: 'Our placeholder story',
      body: 'This copy is intentionally fictional. Replace it with your organization’s purpose, history, and the people it serves when adapting the template.',
      caption: 'Sample media demonstrates the image module with required alternative text.',
    },
  },
  contact: {
    hero: {
      title: 'Contact',
      body: 'Use the sample details or form below to demonstrate an external contact workflow.',
    },
    info: {
      title: 'Get in touch',
      labelOne: 'Email',
      valueOne: 'hello@example.test',
    },
    form: {
      title: 'Send a message',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      submit: 'Send',
      sending: 'Sending…',
      success: 'Thanks — your message was sent.',
      handoff: 'Your mail app opened. Review the message there and send it.',
      error: 'We could not send your message. Try again later.',
      configError:
        'This form is not connected to an external service yet.',
      required: 'This field is required.',
      invalidEmail: 'Enter a valid email address.',
    },
  },
  members: {
    hero: {
      title: 'Members',
      body: 'A sample directory shows how repeatable cards can present people, programs, or resources.',
    },
    directory: {
      title: 'Sample member directory',
      cardOneTitle: 'Sample member',
      cardOneBody: 'This placeholder card is replaced by rows from the public sample sheet when configured.',
    },
  },
  events: {
    hero: {
      title: 'Events',
      body: 'Browse fictional events in list and calendar views.',
    },
    calendar: {
      title: 'Sample event calendar',
      upcomingTitle: 'Coming up',
      eventOneTitle: 'Sample neighborhood gathering',
      eventOneDetail: 'A fictional event used to demonstrate the calendar module.',
    },
  },
  app: {
    notFound: {
      body: 'Page not found.',
    },
  },
  modules: {
    calendar: {
      upcoming: 'Next events',
      previousMonth: 'Previous month',
      nextMonth: 'Next month',
    },
    fallback: {
      unknownType: 'This module type is not registered.',
      invalid: 'This module could not be displayed.',
      unhydrated: 'This content is not available yet.',
    },
  },
  updatable: {
    fallback: {
      unavailable: 'This content is being updated and will appear shortly.',
      empty: 'No entries to show yet.',
      malformed: 'This content is temporarily unavailable.',
    },
  },
}
