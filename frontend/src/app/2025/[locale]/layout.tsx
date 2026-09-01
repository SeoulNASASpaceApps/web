export const generateStaticParams = async () => {
  return [
    { locale: 'ko' },
    { locale: 'en' }
  ]
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}