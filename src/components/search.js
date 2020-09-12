import React, { useContext, useRef } from "react";
import Select from "react-select";
import { Button, Loading } from "@wfp/ui";
import { StateContext } from "../App.js";
import { getResponse, addLayer } from "./utils.js";
import { processHazard } from "./hazards.js";
import { Icon } from "@wfp/ui";
import { iconSearch } from "@wfp/icons";
import { notificationStyle } from "@wfp/ui";
import { ToastContainer, toast } from "react-toastify";

const SearchMenu = ({ trigger }) => {
  const { search, searchState, setState, map } = useContext(StateContext);

  const getData = () => {
    setState((p) => {
      return { ...p, status: "FETCH" };
    });
    const hazardVal = searchState.hazard.value;

    getResponse(searchState.country, hazardVal)
      .then((res) => {
        setState((p) => {
          return {
            ...p,
            geojson: res.geojson,
            summary: res.summary,
            dashboard: res.dashboard,
          };
        });

        return processHazard(
          hazardVal,
          res.geojson,
          res.summary,
          searchState.month
        );
      })
      .then((res) => {
        let chartData = res.chartData;
        chartData = {
          ...chartData,
          country: searchState.country.label,
          type: hazardVal,
        };

        setState((p) => {
          return {
            ...p,
            status: "SUCCESS",
            chartData: chartData,
            legendData: res.legendData,
            month: 0,
          };
        });

        trigger.current.classList.toggle("is_open");
        addLayer("country", res.geom, map);
      })
      .catch((e) => {
        console.log(e);
        toast.error("Hazard not found for country");
        setState((p) => {
          return { ...p, status: "ERROR" };
        });
      });
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      height: "34px",
      "min-height": "34px",
    }),
  };

  return (
    <div ref={trigger} className="pt2 bg-light-gray search is_open">
      <div className="w-70 center f7">
        <Select
          isClearable={true}
          placeholder="Search country"
          options={search.countries}
          value={searchState.country}
          styles={customStyles}
          onChange={(value) =>
            setState((p) => {
              return { ...p, country: value };
            })
          }
          className="mv2 gray"
          maxMenuHeight={150}
        />
        <Select
          isClearable={true}
          placeholder="Search hazard"
          options={search.hazards}
          value={searchState.hazard}
          styles={customStyles}
          onChange={(value) =>
            setState((p) => {
              return { ...p, hazard: value };
            })
          }
          className="mv2 gray"
        />
        <Button
          disabled={searchState.country === null}
          onClick={getData}
          kind="danger--primary"
        >
          Go!
        </Button>
        {searchState.status === "FETCH" ? <Loading /> : null}
      </div>
    </div>
  );
};

const SearchButton = ({ trigger }) => {
  const toggleSearch = () => {
    trigger.current.classList.toggle("is_open");
  };

  return (
    <div
      onClick={toggleSearch}
      className="pl2 pv2 hover-interactive-02 link pointer flex items-center w-25 tc"
    >
      <span>Search</span>
      <Icon className="ml2 fill-white h1 w1" icon={iconSearch} />
    </div>
  );
};

export const Search = () => {
  const trigger = useRef();

  const notification_style = { ...notificationStyle, position: "top-right" };

  return (
    <div>
      <ToastContainer {...notification_style} />
      <SearchButton trigger={trigger} />
      <SearchMenu trigger={trigger} />
    </div>
  );
};
