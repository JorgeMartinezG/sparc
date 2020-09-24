import React from "react";
import { ModalWrapper } from "@wfp/ui";

export const LayerInfo = ({ layer }) => {
  if (layer === null) return null;

  return (
    <ModalWrapper
      id="layer-info"
      buttonTriggerText="Info"
      modalLabel="Layer information"
      modalHeading={layer.title}
      passiveModal
    >
      <div className="f6">
        <p className="mb2 f6">{layer.description}</p>
        <p className="mt3 mb2 f5 b">Layer Type</p>
        <p className="mv2 f6">{layer.type}</p>
        <p className="mv2 f5 b">Attribution: {layer.source.attribution}</p>
        <p className="mv2 f6">{layer.source.name}</p>
      </div>
    </ModalWrapper>
  );
};
