import React, { useContext, useRef } from "react";
import Select from "react-select";
import { Button, Loading } from "@wfp/ui";
import { StateContext } from "../App.js";
import { getGeom } from "./utils.js";
import { Icon } from "@wfp/ui";
import { iconSearch } from "@wfp/icons";
import { notificationStyle } from "@wfp/ui";
import { ToastContainer, toast } from "react-toastify";

const SearchMenu = ({ trigger }) => {
  const { search, searchState, setState, map } = useContext(StateContext);

  const getData = () => {
    setState((p) => {
      return { ...p, loading: true };
    });

    getGeom(map, searchState.country, searchState.hazard.value)
      .then((res) => {
        setState((p) => {
          return {
            ...p,
            loading: false,
            chartData: res.chartData,
            legendData: res.legendData,
          };
        });
      })
      .catch((e) => {
        console.log(e);
        toast.error("Hazard not found for country");
        setState((p) => {
          return { ...p, loading: false };
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
        {searchState.loading === true ? <Loading /> : null}
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

  return (
    <div>
      <ToastContainer {...notificationStyle} />
      <SearchButton trigger={trigger} />
      <SearchMenu trigger={trigger} />
    </div>
  );
};
