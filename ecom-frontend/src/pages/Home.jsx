import React from "react"
import { useParams } from "react-router-dom"
import { buildUrl } from "../config/api"
import Hero from "../components/Banners/BannersTypeOne/Hero"
import CategorySection from "../components/Banners/BannersTypeOne/CategorySection"
import PromoBanner from "../components/Banners/PromoBanner"
import NewArrivals from "../components/NewArrival"
const api = (path) => buildUrl(`/api${path}`);
function Home(){
        const slug = "home"
        const [collection, setCollection] = React.useState(null);
    
        React.useEffect(() => {
          const fetchCollection = async () => {
            try {
              const res = await fetch(api(`/collections/${slug}`));
              const data = await res.json();
              setCollection(data);
            } catch (err) {
              console.error(err);
            }
          };
        
          fetchCollection();
        }, [slug]);
        
    return(
        <>
        {collection?.components?.map((comp,index)=>{
            switch(comp.type){
               case "hero" :
                return (<Hero key={index}  section={comp.data?.item} assetKey={comp.data?.item?.asset_key} type={slug}/>)
               case "two-column" :
                return (<CategorySection key={index} menSection={comp.data?.left} womenSection={comp.data?.right} type={slug}/>)
            }
        })}
        <section className="hero">
           
            
        </section>
        <section>
            
            <PromoBanner/>
            <NewArrivals/>
        </section>
        </>
    )
}
export default Home