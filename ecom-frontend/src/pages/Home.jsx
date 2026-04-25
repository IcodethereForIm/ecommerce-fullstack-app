import React from "react"
import { useParams } from "react-router-dom"
import { buildUrl } from "../config/api"
import Hero from "../components/Banners/BannersTypeOne/Hero"
import CategorySection from "../components/Banners/BannersTypeOne/CategorySection"
import PromoBanner from "../components/Banners/PromoBanner"
import NewArrivals from "../components/NewArrival"
import { getFilteredProducts } from "../services/ProductFilterService"
import ProductScrollSection from "../components/ProductScrollSection"
import { CartContext } from "../context/CartContext"
const api = (path) => buildUrl(`/api${path}`);
function Home(){
        const slug = "home"
        const [collection, setCollection] = React.useState(null);
        const [products, setProducts] = React.useState([]);
        const { addToCart } = React.useContext(CartContext);
    
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
        
        React.useEffect(() => {
            const fetchProducts = async () => {
              const results = await Promise.all(
                collection.components.map(async (comp, index) => {
                  if (comp.type !== "products") return null;
          
                  try {
                    const data = await getFilteredProducts(comp.data?.source,comp.data?.limit)
                    
          
                    return { index, data };
          
                  } catch (err) {
                    console.error(err);
                    return null;
                  }
                })
              );
          
              //  Store all results at once (cleaner)
              const formatted = {};
              results.forEach((item) => {
                if (item) {
                  formatted[item.index] = item.data;
                }
              });
          
              setProducts(formatted);
            };
          
            if (collection?.components) {
              fetchProducts();
            }
          }, [collection]);

        
    return(
        <>
        {collection?.components?.map((comp,index)=>{
            switch(comp.type){
               case "hero" :
                return (<Hero key={index}  section={comp.data?.item} assetKey={comp.data?.item?.asset_key} type={slug}/>)
               case "two-column" :
                return (<CategorySection key={index} menSection={comp.data?.left} womenSection={comp.data?.right} type={slug}/>)
              case "products":
                return (
                  <ProductScrollSection
              key={index}
              products={products[index] || []}
              addToCart={addToCart}
              title={comp.data?.source?.type}
              />
                )
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