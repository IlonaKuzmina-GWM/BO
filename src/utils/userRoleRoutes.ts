export const dashRoute = "/dashboard";
export const roleRoutes: { [key: string]: string[] } = {
    merchant: [
      `${dashRoute}`,
      `${dashRoute}/transactions`,
      `${dashRoute}/settings`,
      `${dashRoute}/logs`,
      `${dashRoute}/manager`,
    ],
    manager: [
      `${dashRoute}`,
      `${dashRoute}/transactions`,
      `${dashRoute}/settings`,
      `${dashRoute}/logs`,
      `${dashRoute}/manager`,
    ],
    user: [`${dashRoute}`, `${dashRoute}/transactions`],
    agent: [`${dashRoute}`, `${dashRoute}/transactions`, `${dashRoute}/manager`],
    support: [`${dashRoute}`, `${dashRoute}/transactions`, `${dashRoute}/logs`],
    finance: [`${dashRoute}`, `${dashRoute}/transactions`],
    admin: [
      `${dashRoute}`,
      `${dashRoute}/transactions`,
      `${dashRoute}/settings`,
      `${dashRoute}/logs`,
      `${dashRoute}/siins`,
      `${dashRoute}/generateCSV`,
      `${dashRoute}/manager`,
    ],
    owner: [
      `${dashRoute}`,
      `${dashRoute}/transactions`,
      `${dashRoute}/settings`,
      `${dashRoute}/logs`,
      `${dashRoute}/siins`,
      `${dashRoute}/generateCSV`,
      `${dashRoute}/manager`,
      `${dashRoute}/settlement`,
    ],
    developer: [],
  };

  export const protectedRoutes = [
    `${dashRoute}`,
    `${dashRoute}/transactions`,
    `${dashRoute}/logs`,
    `${dashRoute}/siins`,
    `${dashRoute}/generateCSV`,
    `${dashRoute}/settlement`,
    `${dashRoute}/manager`,
    `${dashRoute}/settings`,
  ];
  