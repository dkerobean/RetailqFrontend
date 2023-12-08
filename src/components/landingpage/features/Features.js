import React from 'react';
import FeaturesTitle from './FeaturesTitle';
import { Typography, Grid, Container, Box } from '@mui/material';
import {
  IconAdjustments,
  IconArchive,
  IconArrowsShuffle,
  IconBook,
  IconBuildingCarousel,
  IconCalendar,
  IconChartPie,
  IconDatabase,
  IconDiamond,
  IconLanguageKatakana,
  IconLayersIntersect,
  IconMessages,
  IconRefresh,
  IconShieldLock,
  IconTag,
  IconWand,
} from '@tabler/icons';
import AnimationFadeIn from '../animation/Animation';

const featuresData = [
  {
    icon: <IconWand width={40} height={40} strokeWidth={1.5} />,
    title: 'User Management',
    subtext: 'Effortlessly register, log in, and manage your account details, ensuring a personalized and secure experience.',
  },
  {
    icon: <IconShieldLock width={40} height={40} strokeWidth={1.5} />,
    title: 'Transaction Tracking',
    subtext: 'Record and categorize income and expenses with intuitive tools for accurate financial tracking.',
  },
  {
    icon: <IconArchive width={40} height={40} strokeWidth={1.5} />,
    title: 'Invoice Management',
    subtext: 'Generate, manage, and track invoices effortlessly. Stay on top of payment status and send reminders to ensure a healthy cash flow.',
  },
  {
    icon: <IconAdjustments width={40} height={40} strokeWidth={1.5} />,
    title: 'Financial Reports',
    subtext: 'Gain valuable insights with detailed financial reports to make informed decisions and drive your business forward',
  },
  {
    icon: <IconTag width={40} height={40} strokeWidth={1.5} />,
    title: 'Notification System',
    subtext: 'Never miss a beat with our robust notification system for subscription renewals, upcoming invoice due dates, and other critical financial events.',
  },
  {
    icon: <IconDiamond width={40} height={40} strokeWidth={1.5} />,
    title: 'User Dashboard',
    subtext: 'Experience an intuitive dashboard displaying key financial metrics, recent transactions, and upcoming invoices at a glance.',
  },
  {
    icon: <IconDatabase width={40} height={40} strokeWidth={1.5} />,
    title: 'User Support',
    subtext: 'Our dedicated support system is here to assist you with any questions or issues you may encounter, ensuring you get the most out of our app.',
  },
  {
    icon: <IconLanguageKatakana width={40} height={40} strokeWidth={1.5} />,
    title: 'Expense Categories',
    subtext: 'Categorize expenses for better tracking and reporting, bringing clarity to your financial picture.',
  },
  {
    icon: <IconBuildingCarousel width={40} height={40} strokeWidth={1.5} />,
    title: 'Bank Integration',
    subtext: 'Automatically fetch and categorize transactions by integrating with financial institutions, saving you time and reducing errors.',
  },
  {
    icon: <IconArrowsShuffle width={40} height={40} strokeWidth={1.5} />,
    title: 'Budgeting',
    subtext: 'Set budgets and receive alerts when approaching limits, providing proactive financial management.',
  },
  {
    icon: <IconChartPie width={40} height={40} strokeWidth={1.5} />,
    title: 'Tax Tracking',
    subtext: 'Effortlessly prepare for tax obligations with tools for tracking and generating detailed tax reports.',
  },
  {
    icon: <IconLayersIntersect width={40} height={40} strokeWidth={1.5} />,
    title: 'Multi-Currency Support',
    subtext: 'Record transactions and invoices in multiple currencies to accommodate global operations.',
  },
  {
    icon: <IconRefresh width={40} height={40} strokeWidth={1.5} />,
    title: 'Inventory Management',
    subtext: 'For ecommerce businesses, seamlessly integrate with inventory management features to track stock levels, sales, and reorder points',
  },
  {
    icon: <IconBook width={40} height={40} strokeWidth={1.5} />,
    title: 'Customer Relationship Management (CRM)',
    subtext: 'Manage customer interactions, contact information, and communication history with integrated CRM functionalities.',
  },
  {
    icon: <IconCalendar width={40} height={40} strokeWidth={1.5} />,
    title: 'Mobile Accessibility',
    subtext: 'Access your financial data on the go with our responsive design or dedicated mobile app for various devices.',
  },
  {
    icon: <IconMessages width={40} height={40} strokeWidth={1.5} />,
    title: 'File Uploads:',
    subtext: 'Attach receipts and relevant documents to transactions and invoices, keeping everything in one place',
  },
];

const Features = () => {
  return (
    <Box py={6}>
      <Container maxWidth="lg">
        <FeaturesTitle />

        <Box mt={6}>
          <Grid container spacing={3}>
            {featuresData.map((feature, index) => (
              <Grid item xs={12} sm={4} lg={3} textAlign="center" key={index}>
                <AnimationFadeIn>
                  <Box color="primary.main">{feature.icon}</Box>
                  <Typography variant="h5" mt={3}>
                    {feature.title}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary" mt={1} mb={3}>
                    {feature.subtext}
                  </Typography>
                </AnimationFadeIn>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Features;
