import React, {
  useContext,
  useMemo,
  useEffect,
  useState,
  useLayoutEffect,
} from "react";
import { Header } from "../components/header.js";
import { handleLayer } from "../components/layers.js";
import { PdfRenderer } from "../components/pdf.js";
import { StateContext } from "../App.js";
import { Bar } from "react-chartjs-2";
import { LayerInfo } from "./layerInfo.js";
import { Tab, Tabs, Slider } from "@wfp/ui";
import { LAYERS } from "../config.js";
import Select from "react-select";
import showdown from "showdown";

const Opts = (country) => {
  return {
    title: {
      position: "top",
      text: "Population at Risk for admin0 " + country,
      display: true,
      fontSize: "16",
    },
    scales: {
      xAxes: [
        {
          ticks: {
            fontSize: 14,
          },
        },
      ],
    },
  };
};

const Chart = ({ chartData, description }) => {
  const MemoChart = () => {
    const { data, country } = chartData;
    const opts = Opts(country);

    if (country === undefined) {
      return null;
    }

    return (
      <div>
        <Bar id="chart" data={data} options={opts} height={250} />
        <div id="description" dangerouslySetInnerHTML={description} />
      </div>
    );
  };

  return useMemo(MemoChart, [chartData]);
};

export const TransformDescription = (description) => {
  const converter = new showdown.Converter();

  return {
    __html: converter.makeHtml(description),
  };
};

const Downloads = () => {
  return (
    <div>
      <p className="f5 pb2 b">Downloads</p>
      <PdfRenderer />
    </div>
  );
};

const SidebarTabs = ({ searchState, map }) => {
  const { chartData, dashboard } = searchState;

  const description = TransformDescription(
    dashboard.sidebar.ui.charts[0].description
  );

  return (
    <Tabs className="mb2 navlist center">
      <Tab label="Data">
        <div className="w-90 center pv3">
          <Downloads />
          <Chart chartData={chartData} description={description} />
        </div>
      </Tab>
      <Tab label="Options">
        <Options />
      </Tab>
    </Tabs>
  );
};

const WFPSlider = ({ map, layer }) => {
  const [val, setVal] = useState({ min: 0, max: 0, title: null });
  useLayoutEffect(() => {
    console.log(layer);
    if (!layer || !layer.filters) {
      return;
    }
    const filters = layer.filters.filter((l) => l.output === "popatrisk_range");

    if (filters.length === 0) {
      return;
    }
    const filter = filters[0];
    const { min, max } = filter.ui.slider;

    setVal({ min: min, max: max, title: filter.title });
  }, [layer]);

  const { min, max, title } = val;
  if (max === 0) return null;

  return (
    <div className="mt2 absolute w-90">
      <Slider
        id="slider"
        value={max}
        min={min}
        max={max}
        labelText={title}
        onChange={(v) =>
          map.setFilter(LAYERS.GEOJSON, ["<=", ["number", ["get", "value"]], v])
        }
      />
    </div>
  );
};

const Options = () => {
  const tempLayers = [
    "popatrisk",
    "context_mean_change",
    "context_positive_change",
    "context_negative_change",
    "context_forest_change",
    "context_crop_change",
    "context_erosion",
    "context_ldi",
    "world_pop",
    "forecast_1day",
    "forecast_3day",
    "forecast_6day",
    "nrt_1day",
    "nrt_3day",
    "nrt_4day",
  ];

  const DEFAULT_LAYER = "popatrisk";
  const { searchState, map, setLegend, setState, setGeom } = useContext(
    StateContext
  );
  const { dashboard, layer } = searchState;

  const hazardLayers = dashboard.sidebar.ui.layers;
  const filteredlayers = dashboard.featurelayers
    .filter((l) => hazardLayers.includes(l.id))
    .filter((l) => tempLayers.includes(l.id));

  const defaultArray = filteredlayers.filter((l) => l.id === DEFAULT_LAYER)[0];

  useEffect(() => {
    setState((s) => {
      return { ...s, layer: defaultArray };
    });
  }, [defaultArray, setState]);

  const handleSelect = (opt) => {
    let month = null;
    if (opt.id === DEFAULT_LAYER) {
      month = 0;
    }

    setState((s) => {
      return { ...s, layer: opt, month: month };
    });
  };

  useEffect(() => {
    if (searchState.layer === null) {
      return;
    }

    const { geom, legend } = handleLayer(searchState, map);
    setLegend(legend);
    setGeom(geom);
  }, [searchState, map, setLegend, setGeom]);

  return (
    <div className="w-90 center h-100">
      <p className="f5 pv2 b">Layers</p>

      <Select
        classNamePrefix="react-select"
        isClearable={false}
        getOptionLabel={(option) => option.title}
        getOptionValue={(option) => option.id}
        options={filteredlayers}
        className="b w-80 fl"
        placeholder="Search layer"
        value={layer}
        onChange={(opt) => handleSelect(opt)}
      />
      <LayerInfo layer={layer} />
      <WFPSlider layer={layer} map={map} />
    </div>
  );
};

export const Sidebar = ({ sidebarRef }) => {
  const { searchState, map } = useContext(StateContext);

  return (
    <div
      ref={sidebarRef}
      className="w-30 bg-near-white shadow-2 sidebar absolute z-2 mv3 flex flex-column"
    >
      <Header />
      {searchState.status === "SUCCESS" ? (
        <SidebarTabs searchState={searchState} map={map} />
      ) : null}
    </div>
  );
};
