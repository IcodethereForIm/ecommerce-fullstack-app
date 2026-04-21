import React, { useEffect, useState, useContext } from "react";
import { buildUrl } from "../config/api";
import { useParams } from "react-router-dom"; // <-- import useParams
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import CategoryBanner from "../components/Banners/BannersTypeTwo/CategoryBanner";
import TwoColumnSection from "../components/Banners/BannersTypeTwo/TwoCollumn";
import { getFilteredProducts } from "../services/ProductFilterService";
import ProductScrollSection from "../components/ProductScrollSection";
//import "./CategoryProducts.css";
const api = (path) => buildUrl(`/api${path}`);

const CategoryProducts = () => {
  const { slug } = useParams(); // <-- get category from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
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

  //if (loading) return <p>Loading products...</p>;
  //if (!products.length) return <p>No products found in "{category}" category.</p>;

  return (
    <div className="category-page">
      {collection?.components?.map((comp,index)=>{
        switch(comp.type){
          case "hero" :
            return (<CategoryBanner key={index} section={comp.data?.item} type={slug} assetKey={comp.data?.item?.asset_key}/>)
          case "two-column" :
            return (<TwoColumnSection key={index} upperSection={comp.data?.left} bottomsSection={comp.data?.right} type={slug}/>)
          case "products" :
            return (
              <ProductScrollSection
              key={index}
              products={products[index] || []}
              addToCart={addToCart}
              title={`${slug.toUpperCase()} PRODUCTS`}
              />
            )
          default:
            return null;
        }
      })}
      
    </div>
  );
};

export default CategoryProducts;