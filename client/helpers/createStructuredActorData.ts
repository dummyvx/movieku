

const createStructuredActorData = (name: string): string => `{
    "@type": "Person",
    "name": "${name}"
  }`

export default createStructuredActorData