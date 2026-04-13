import React from "react";
import { Link } from "react-router-dom";
import CategoryAdmin from "../components/Admin/CategoryAdmin";
import CategoryDropdown from "../components/Admin/CategoryDropdown";
import AdminCollectionForm from "../components/Admin/AdminLayoutController";
import ProductController from "../components/Admin/ProductController";
import SiteAset from "../components/Admin/SiteAsetController";

function Admin() {

    
    
    

    

    return (
         
        <div className="container py-4">
  <h2 className="mb-4 fw-bold text-center">Admin Dashboard</h2>

  <div className="row g-4">

    {/* Collection */}
    <div className="col-12">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white fw-semibold">
          Collection Management
        </div>
        <div className="card-body">
          <AdminCollectionForm />
        </div>
      </div>
    </div>

    {/* Category + Product side by side */}
    <div className="col-md-6">
      <div className="card shadow-sm border-0 h-100">
        <div className="card-header bg-primary text-white fw-semibold">
          Category Management
        </div>
        <div className="card-body">
          <CategoryAdmin />
        </div>
      </div>
    </div>

    <div className="col-md-6">
      <div className="card shadow-sm border-0 h-100">
        <div className="card-header bg-success text-white fw-semibold">
          Product Management
        </div>
        <div className="card-body">
          <ProductController />
        </div>
      </div>
    </div>

    {/* Site Assets */}
    <div className="col-12">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-secondary text-white fw-semibold">
          Site Assets
        </div>
        <div className="card-body">
          <SiteAset />
        </div>
      </div>
    </div>

  </div>
</div>
    );
}

export default Admin;