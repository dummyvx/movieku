import { useState, createContext, Context, ReactNode } from "react";
import { APIResponse, Series } from "../types";

const initValue = { data: [], info: { allPage: 0, nextURL: "", page: 0 } };

type Response = APIResponse<Array<Series>>;
const seriesState = () => {
  const [series] = useState<Response | undefined>(initValue);
  const [completed] = useState<Response | undefined>(initValue);
  const [ongoing] = useState<Response | undefined>(initValue);
  const [seri] = useState<Series | null>();
  const [trendingSeries] = useState<Response | undefined>(undefined);

  const addSeries = (_newSeries: Array<Series>): void => {};
  const setCurrentSeries = (_newSeri: Series): void => {};

  return {
    seri,
    setCurrentSeries,
    series,
    trendingSeries,
    addSeries,
    addTrendingSeries: addSeries,
    completed,
    addCompleted: addSeries,
    ongoing,
    addOngoing: addSeries,
  };
};
export type TypeSeriesState = ReturnType<typeof seriesState>;

export const SeriesContext = createContext<TypeSeriesState | null>(
  null
) as Context<TypeSeriesState>;

const SeriesContextProvider = ({
  children,
  seriesResponse,
  trendingSeries,
  completed,
  ongoing,
  seri,
}: {
  children: ReactNode;
  seriesResponse?: Response;
  trendingSeries?: Response;
  completed?: Response;
  ongoing?: Response;
  seri?: Series;
}) => {
  const [series, setSeries] = useState<Response | undefined>(seriesResponse);
  const [_completed, setCompleted] = useState<Response | undefined>(completed);
  const [_ongoing, setOngoing] = useState<Response | undefined>(ongoing);
  const [_seri, set_seri] = useState<Series | undefined>(seri);
  const [_trendingSeries, setTrendingSeries] = useState<Response | undefined>(
    trendingSeries
  );

  const addSeries = (newSeries: Array<Series>): void => {
    setSeries((prev) => ({
      ...(prev ?? initValue),
      data: [...(prev?.data ?? []), ...newSeries],
    }));
    return;
  };

  const addCompleted = (newSeries: Array<Series>): void => {
    setCompleted((prev) => ({
      ...(prev ?? initValue),
      data: [...(prev?.data ?? []), ...newSeries],
    }));
    return;
  };

  const addOngoing = (newSeries: Array<Series>): void => {
    setOngoing((prev) => ({
      ...(prev ?? initValue),
      data: [...(prev?.data ?? []), ...newSeries],
    }));
    return;
  };

  const setCurrentSeries = (newSeries: Series): void => {
    set_seri((prev) => ({ ...(prev ?? {}), ...newSeries }));
    return;
  };

  const addTrendingSeries = (newSeries: Array<Series>): void => {
    setTrendingSeries((prev) => ({
      ...(prev ?? initValue),
      data: [...(prev?.data ?? []), ...newSeries],
    }));
    return;
  };

  return (
    <SeriesContext.Provider
      value={{
        series,
        seri,
        setCurrentSeries,
        addSeries,
        trendingSeries: _trendingSeries,
        completed: _completed,
        addCompleted,
        ongoing: _ongoing,
        addOngoing,
        addTrendingSeries,
      }}
    >
      {children}
    </SeriesContext.Provider>
  );
};

export default SeriesContextProvider;
