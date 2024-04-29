export const url = process.env.URL || 'http://localhost:8080';
export const siteName = 'cantautor.es';
export const siteDescription = 'Supporting spanish musicians';
export const siteType = 'Person'; // schema
export const locale = 'en_EN';
export const lang = 'en';
export const skipContent = 'Skip to content';
export const author = {
  name: 'Lene Saile and Dani Grau', // i.e. Lene Saile - page / blog author's name. Must be set.
  avatar: '/favicon.png',
  email: 'hello@badwebsites.rip', // i.e. hola@lenesaile.com - email of the author
  website: 'https://badwebsites.rip/#team' // i.e. https.://www.lenesaile.com - the personal site of the author
};
export const developer = {
  name: 'Lene Saile', // i.e. Lene Saile - creator's (developer) name.
  email: 'hola@lenesaile.com',
  website: 'https://badwebsites.rip/#team',
  social: 'https://front-end.social/@lene'
};
export const designer = {
  name: 'Daniela Grau', // i.e. Lene Saile - creator's (developer) name.
  email: 'd.grrrau@gmail.com',
  website: 'https://www.lenesaile.com'
};
export const themeColor = '#e84700'; //  Manifest: defines the default theme color for the application
export const themeBgColor = '#e84700'; // Manifest: defines a placeholder background color for the application page to display before its stylesheet is loaded
export const opengraph_default = '/assets/images/template/opengraph-default.jpg'; // fallback/default meta image
export const opengraph_default_alt = 'cantautores logo'; // alt text for default meta image
export const blog = {
  // RSS feed
  name: 'My Web Development Blog',
  description: 'Tell the word what you are writing about in your blog. It will show up on feed readers.',
  // feed links are looped over in the head. You may add more to the array.
  feedLinks: [
    {
      title: 'Atom Feed',
      url: '/feed.xml',
      type: 'application/atom+xml'
    }
  ],
  // Tags
  tagSingle: 'Tag',
  tagPlural: 'Tags',
  tagMore: 'More tags:',
  // pagination
  paginationLabel: 'Blog',
  paginationPage: 'Page',
  paginationPrevious: 'Previous',
  paginationNext: 'Next',
  paginationNumbers: true
};
export const details = {
  aria: 'section controls',
  expand: 'expand all',
  collapse: 'collapse all'
};
export const navigation = {
  ariaTop: 'Main',
  ariaBottom: 'Complementary',
  ariaPlatforms: 'Platforms',
  // activate alternative mobile menu with drawer
  drawerNav: false,
  navLabel: 'Menu'
};
export const themeSwitch = {
  title: 'Theme',
  light: 'light',
  dark: 'dark'
};
export const initial = 'select';
export const greenweb = {
  // this goes into src/common/greenweb.njk
  providers: {
    // if you want to add more than one, edit the array directly.
    domain: 'netlify.com',
    service: 'cdn'
  },
  credentials: {
    // optional, eg: 	{ domain='my-org.com', doctype = 'webpage', url = 'https://my-org.com/our-climate-record'}
    domain: '',
    doctype: '',
    url: ''
  }
};
export const viewRepo = {
  // this is for the view/edit on github link. The value in the package.json will be pulled in.
  allow: true,
  infoText: 'View this page on GitHub'
};
export const easteregg = true;
