


import Banner from "./home/Banner"
import BestSellers from "./home/BestSellers"
import Review from "./home/Review"
import NewItems from "./home/NewItems"
import UserLayout from "../customUi/UserLayout"

// Main HomePage Component
const HomeComponents = () => {
  return (
    <UserLayout>
      <Banner />
      <BestSellers />
      <Review/>
      <NewItems />
    </UserLayout>
      
    
  )
}

export default HomeComponents;