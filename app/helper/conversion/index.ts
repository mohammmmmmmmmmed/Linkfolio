type Title = {
  title: string;
  query: string;
}[];
const titles: Title = [
  {
    title: 'Software Engineer',
    query: 'swe',
  },
  {
    title: 'Front End Developer',
    query: 'fe',
  },
  {
    title: 'Back End Developer',
    query: 'be',
  },
  {
    title: 'UI/UX Designer',
    query: 'ui',
  },
  {
    title: 'Product Designer',
    query: 'pd',
  },
];

export function convertTitle(convert: string) {
  let found = titles.find((title) => {
    if (title.query === convert) {
      return title.title;
    }
  });
  return String(found?.title);
}
