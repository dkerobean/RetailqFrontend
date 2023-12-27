import React from 'react';
import { Box, Grid } from '@mui/material';
import WeeklyStats from 'src/components/dashboards/modern/WeeklyStats';
import YearlySales from 'src/components/dashboards/ecommerce/CashFlow';
import PaymentGateways from 'src/components/dashboards/ecommerce/ExpenseCategory';
import WelcomeCard from 'src/components/dashboards/ecommerce/WelcomeCard';
import Payment from 'src/components/dashboards/ecommerce/Payment';
import SalesProfit from 'src/components/dashboards/ecommerce/SalesProfit';
import RevenueUpdates from 'src/components/dashboards/ecommerce/ProductSales';
import SalesOverview from 'src/components/dashboards/ecommerce/SalesOverview';
import TotalEarning from 'src/components/dashboards/ecommerce/TotalEarning';
import ProductsSold from 'src/components/dashboards/ecommerce/ProductsSold';
import MonthlyEarnings from 'src/components/dashboards/ecommerce/MonthlyCashflow';
import ProductPerformances from 'src/components/dashboards/ecommerce/ProductPerformances';
import RecentTransactions from 'src/components/dashboards/ecommerce/RecentTransactions';
import Customers from 'src/components/dashboards/ecommerce/TopCards';

const Ecommerce = () => {
  return (
    <Box mt={3}>
      <Grid container spacing={3}>
        {/* column */}
        <Grid item xs={12} lg={12}>
          <WelcomeCard />
        </Grid>
        {/* column */}
        <Grid item xs={12} lg={12}>
          <Customers />
        </Grid>
        {/* column */}
        {/* <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Payment />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ProductsSold />
            </Grid>
          </Grid>
        </Grid> */}
        <Grid item xs={12} sm={6} lg={4}>
          <RevenueUpdates />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <SalesOverview />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TotalEarning />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SalesProfit />
            </Grid>
            <Grid item xs={12}>
              <MonthlyEarnings />
            </Grid>
          </Grid>
        </Grid>
        {/* column */}
        {/* <Grid item xs={12} sm={6} lg={4}>
          <WeeklyStats />
        </Grid> */}
        {/* column */}
        <Grid item xs={12} lg={6}>
          <YearlySales />
        </Grid>
        {/* column */}
        <Grid item xs={12} lg={6}>
          <PaymentGateways />
        </Grid>
        {/* column */}

        <Grid item xs={12} lg={4}>
          <RecentTransactions />
        </Grid>
        {/* column */}

        <Grid item xs={12} lg={8}>
          <ProductPerformances />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Ecommerce;
