import React from "react";
import { Typography } from "@material-tailwind/react";
import { SecondAppEmbed } from './index';

export function PageOnHold() {

  return (
    <div className="mt-12">
      <div id="heading-tit"><h2>Ajouter une commande</h2></div>
      <SecondAppEmbed/>
    </div>
  );
}

export default PageOnHold;
