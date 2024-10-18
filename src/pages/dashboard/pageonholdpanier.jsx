import React from "react";
import { Typography } from "@material-tailwind/react";
import { SecondAppEmbedPanier } from './index';

export function PageOnHoldPanier() {

  return (
    <div className="mt-12">
      <div id="heading-tit"><h2>Panier</h2></div>
      <SecondAppEmbedPanier/>
    </div>
  );
}

export default PageOnHoldPanier;
