import React from "react"
import { useParams } from "react-router-dom"
import Hero from "../components/Home/Hero"
import CategorySection from "../components/CategorySection"
import PromoBanner from "../components/PromoBanner"
import NewArrivals from "../components/NewArrival"
function Home(){
        const slug = "home"
        const [collection, setCollection] = React.useState(null);
    
        React.useEffect(() => {
          const fetchCollection = async () => {
            try {
              const res = await fetch(`http://127.0.0.1:8000/api/collections/${slug}`);
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