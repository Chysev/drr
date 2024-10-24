import { getReports } from "./getReports";
import ReportsList from "./ReportList";

import React from "react";

const page = async () => {
  const reports = await getReports();

  return <ReportsList reports={reports} />;
};

export default page;
