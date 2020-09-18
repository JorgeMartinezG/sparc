import React, { useContext, useRef, useState, useEffect } from "react";
import Select from "react-select";
import { Button, Loading } from "@wfp/ui";
import { StateContext } from "../App.js";
import { fetchCountries, fetchHazards, getResponse } from "./utils.js";
import { processHazard } from "./hazards.js";
import { Icon } from "@wfp/ui";
import { iconSearch } from "@wfp/icons";
import { notificationStyle } from "@wfp/ui";
import { ToastContainer, toast } from "react-toastify";

const SearchMenu = ({ trigger }) => {
  const { searchState, setState } = useContext(StateContext);

  // For search component
  const initSearch = { list: null, selected: null };
  const [search, setSearch] = useState({
    countries: initSearch,
    hazards: initSearch,
    status: "IDLE",
  });

  useEffect(() => {
    fetchCountries(setSearch);
    fetchHazards(setSearch);
  }, []);

  const { countries, hazards, status } = search;

  const getData = () => {
    setSearch((p) => {
      return { ...p, status: "FETCHING" };
    });
    const country = search.countries.selected.value;
    const hazard = search.hazards.selected.value;

    getResponse(country, hazard)
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
          hazard,
          res.geojson,
          res.summary,
          searchState.month,
          res.dashboard
        );
      })
      .then((res) => {
        let chartData = res.chartData;
        chartData = {
          ...chartData,
          country: search.countries.selected.label,
          type: hazard,
        };
        setState((p) => {
          return {
            ...p,
            chartData: chartData,
            legendData: res.legendData,
            month: 0,
          };
        });

        trigger.current.classList.toggle("is_open");
        setSearch((p) => {
          return { ...p, status: "SUCCESS" };
        });
      })
      .catch((e) => {
        console.log(e);
        toast.error("Hazard not found for country");
        setSearch((p) => {
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
          options={countries.list}
          value={countries.selected}
          styles={customStyles}
          onChange={(value) =>
            setSearch((p) => {
              return {
                ...p,
                countries: { list: countries.list, selected: value },
              };
            })
          }
          className="mv2 gray"
          maxMenuHeight={150}
        />
        <Select
          isClearable={true}
          placeholder="Search hazard"
          options={hazards.list}
          value={hazards.selected}
          styles={customStyles}
          onChange={(value) =>
            setSearch((p) => {
              return { ...p, hazards: { list: hazards.list, selected: value } };
            })
          }
          className="mv2 gray"
        />
        <Button
          disabled={
            search.countries.selected === null ||
            search.hazards.selected === null
          }
          onClick={getData}
          kind="danger--primary"
        >
          Go!
        </Button>
        {status === "FETCHING" ? <Loading /> : null}
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
