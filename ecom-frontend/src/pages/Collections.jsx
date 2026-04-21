import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { buildUrl } from "../config/api";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import Hero from "../components/Banners/BannersTypeOne/Hero";
import { getFilteredProducts } from "../services/ProductFilterService";
const api = (path) => buildUrl(`/api${path}`);

function CollectionPage(){
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const { addToCart } = useContext(CartContext);
    const [collection, setCollection] = useState(null);

      useEffect(() => {
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

      useEffect(() => {
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

    //  Store all results at once 
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
        
        <div className="collection-page">
            {collection?.components?.map((comp,index)=>{
                switch(comp.type){
                    case "hero" :
                        return (<Hero key={index} section={comp.data?.item} assetKey={comp.data?.item?.asset_key} type={slug}/>)
                    case "products" :
                        return (
              <div key={index} className="container-fluid px-0">
          <h2 className="category-title">
            {slug.toUpperCase()} COLLECTIONS
          </h2>

          <div className="row g-2 mx-0">
            {Array.isArray(products[index]) &&
  products[index].map((product) => (
    <div key={product.id} className="col-6 col-md-4 col-lg-3 px-1">
      <ProductCard product={product} addToCart={addToCart} />
    </div>
))}
          </div>
        </div>
            )
                }
            })}
        </div>
        
    )
}
export default CollectionPage