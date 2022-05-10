

type ListItem = {
  index: number;
  name: string;
  image: string;
  release: string;
  director: string;
  rating: string;
  slug: string;
  status?: string;
}
type CreateStructuredListItem = (params: ListItem) => string;

const createStructuredListItem: CreateStructuredListItem = (params) => {

  const { NEXT_PUBLIC_BASE_URL } = process.env
  const { director, image, index, name, rating, release, slug, status } = params

  const baseURL = `${NEXT_PUBLIC_BASE_URL}/${status ? 'series' : 'movies'}`;

  return `{
        "@type": "ListItem",
        "position": ${index + 1},
        "item": {
          "@type": "Movie",
          "url": "${baseURL}/${slug}",
          "name": "${name}",
          "image": "${image}",
          "dateCreated": "${release}",
          "director": {
            "@type": "Person",
            "name": "${director}"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "${Math.round(Number(rating))}",
            "bestRating": "${Math.round(Number(rating))}",
            "ratingCount": "10000"
          }
        }
      }`
}

export default createStructuredListItem