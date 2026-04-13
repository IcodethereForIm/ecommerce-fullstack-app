import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom"; // <-- import useParams
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import CategoryBanner from "../components/Category/CategoryBanner/CategoryBanner";
import TwoColumnSection from "../components/Category/TwoCollumnSection/TwoCollumn";
//import "./CategoryProducts.css";

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
      const res = await fetch(`http://127.0.0.1:8000/api/collections/${slug}`);
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
            const source = comp.data?.source || {};
  
            let url = "http://127.0.0.1:8000/api/products";
  
            const params = new URLSearchParams();
  
            //  Gender
            if (source.gender) {
              params.append("gender", source.gender);
            }
  
            //  Subcategory
            if (source.subcategory) {
              params.append("subcategory", source.subcategory);
            }
  
            //  Product Type
            if (source.type) {
              params.append("type", source.type);
            }
  
            if (comp.data?.limit) {
              params.append("limit", comp.data.limit);
            }
  
            // Attach query params
            if ([...params].length) {
              url += `?${params.toString()}`;
            }
  
            
  
            const res = await fetch(url);
            const data = await res.json();
  
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
              <div key={index} className="container-fluid px-0">
          <h2 className="category-title">
            {slug.toUpperCase()} PRODUCTS
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
          default:
            return null;
        }
      })}
      
    </div>
  );
};

export default CategoryProducts;