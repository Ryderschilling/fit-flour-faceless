import { Hero } from '@/components/Hero'
import { SocialProofBar } from '@/components/SocialProofBar'
import { FeaturedProducts } from '@/components/FeaturedProducts'
import { WhyFitFlour } from '@/components/WhyFitFlour'
import { ImageWithText } from '@/components/ImageWithText'
import { ReviewQuotes } from '@/components/ReviewQuotes'
import { InstagramFeed } from '@/components/InstagramFeed'
import { GlutenFreeCallout } from '@/components/GlutenFreeCallout'
import { FAQ } from '@/components/FAQ'

export default function HomePage() {
  return (
    <>
      <Hero />
      <SocialProofBar />
      <FeaturedProducts />
      <WhyFitFlour />
      <ImageWithText />
      <ReviewQuotes />
      <InstagramFeed />
      <GlutenFreeCallout />
      <FAQ />
    </>
  )
}
