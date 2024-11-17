

import Header from "@/components/customUi/Header"
import Banner from "./home/Banner"
import BestSellers from "./home/BestSellers"
import Review from "./home/Review"
import NewItems from "./home/NewItems"

// Main HomePage Component
const HomeComponents = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header/>
      <Banner />
      <BestSellers />
      <Review/>
      <NewItems />
    </div>
  )
}

export default HomeComponents;