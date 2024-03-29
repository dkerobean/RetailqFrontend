import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  CardContent,
  ListItemIcon,
  Chip,
  Switch,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { IconCheck, IconX } from '@tabler/icons';
import BlankCard from '../../../components/shared/BlankCard';
import pck1 from 'src/assets/images/backgrounds/silver.png';
import pck2 from 'src/assets/images/backgrounds/bronze.png';
import pck3 from 'src/assets/images/backgrounds/gold.png';
import { PaystackButton } from 'react-paystack';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Pricing',
  },
];


const Pricing = () => {
  const [show, setShow] = React.useState(false);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [userProfile, setUserProfile] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch subscription data from the API
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`${backendUrl}subscription/all/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSubscriptionData(data);
        } else {
          console.error('Failed to fetch subscription data');
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      }
    };

    fetchSubscriptionData();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`${backendUrl}user/profile/view/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  const showToast = (message, type) => {
    toast[type](message);
  };

  const handlePaystackSuccess = (response, plan) => {
    if (response.message === 'Approved') {
      showToast(`Payment successful! Transaction ID: ${response.transaction}`, 'success');
      handleUpgradeSubscription(plan);
    }
  };

  const handleUpgradeSubscription = async (plan) => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        console.log("here is the pla:", plan)

        const upgradeResponse = await fetch(`${backendUrl}subscription/upgrade/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ new_plan: plan }),
        });
        if (upgradeResponse.ok) {
          showToast('Subscription upgraded successfully!', 'success');
        } else {
          showToast('Failed to upgrade subscriptions', 'error');
        }
      } catch (error) {
        showToast(`Error upgrading subscription: ${error.message}`, 'error');
    }
  };

  const handlePaystackError = (error) => {
    showToast(`Payment failed! ${error.message}`, 'error');
  };

  const handlePaystackClose = () => {
    showToast('Payment closed!', 'info');
  };



  const pricing = [
    {
      id: 1,
      package: 'Free',
      plan: 'Free',
      monthlyplan: 'Free',
      avatar: pck1,
      badge: false,
      btntext: 'Choose Free',
      rules: [
        {
          limit: true,
          title: '1 Member',
        },
        {
          limit: true,
          title: 'Transaction Tracking',
        },
        {
          limit: true,
          title: 'Invoice Management',
        },
        {
          limit: true,
          title: 'User Support',
        },
        {
          limit: true,
          title: 'Data Export',
        },
      ],
    },
    {
      id: 2,
      package: 'Standard',
      monthlyplan: subscriptionData.find((item) => item.plan === 'standard_monthly')?.price || 0,
      avatar: pck2,
      badge: true,
      btntext: 'Choose Standard',
      rules: [
        {
          limit: true,
          title: '3 Members',
        },
        {
          limit: true,
          title: 'Financial Reports',
        },
        {
          limit: true,
          title: 'Notification System',
        },
        {
          limit: true,
          title: 'User Dashboard',
        },
        {
          limit: true,
          title: 'Integration with Payment Gateways',
        },
        {
          limit: true,
          title: 'Multi-Currency Support',
        },
        {
          limit: true,
          title: 'Inventory Management',
        },
        {
          limit: false,
          title: 'CRM',
        },
        {
          limit: false,
          title: 'Mobile Accessibility',
        },
         {
          limit: false,
          title: 'File Uploads',
        },
      ],
    },
    {
      id: 3,
      package: 'Premium',
      monthlyplan: subscriptionData.find((item) => item.plan === 'premium_monthly')?.price || 0,
      avatar: pck3,
      badge: false,
      btntext: 'Choose Premium',
      rules: [
        {
          limit: true,
          title: 'Unlimited Members',
        },
        {
          limit: true,
          title: 'Expense Categories',
        },
        {
          limit: true,
          title: 'Bank Integration',
        },
        {
          limit: true,
          title: 'Budgeting',
        },
        {
          limit: true,
          title: 'Tax Tracking',
        },
        {
          limit: true,
          title: 'Multi-Currency Support',
        },
        {
          limit: true,
          title: 'Inventory Management',
        },
        {
          limit: true,
          title: 'CRM',
        },
        {
          limit: true,
          title: 'Mobile Accessibility',
        },
         {
          limit: true,
          title: 'File Uploads',
        },
        {
          limit: true,
          title: 'Forecasting',
        },
      ],
    },
  ];

  const yearlyPrice = (a, b) => a * b;

  const theme = useTheme();
  const warninglight = theme.palette.warning.light;
  const warning = theme.palette.warning.main;

  const StyledChip = styled(Chip)({
    position: 'absolute',
    top: '15px',
    right: '30px',
    backgroundColor: warninglight,
    color: warning,
    textTransform: 'uppercase',
    fontSize: '11px',
  });

  const paystackProps = {
    email: userProfile.user ? userProfile.user.email : '',
    currency: 'GHS',
    phone: 'sss',
    publicKey: process.env.REACT_APP_PS_PUBLIC_TEST_KEY,
    onSuccess: handlePaystackSuccess,
    onClose: handlePaystackClose,
  };

  return (
    <PageContainer title="Pricing" description="This is the Pricing page">
      <ToastContainer />
      {/* breadcrumb */}
      <Breadcrumb title="Pricing" items={BCrumb} />
      {/* end breadcrumb */}

      <Grid container spacing={3} justifyContent="center" mt={3}>
        <Grid item xs={12} sm={10} lg={8} textAlign="center">
          <Typography variant="h2">
            Flexible Plans Tailored to Fit Your Community's Unique Needs!
          </Typography>
          <Box display="flex" alignItems="center" mt={3} justifyContent="center">
            <Typography variant="subtitle1">Monthly</Typography>
            <Switch onChange={() => setShow(!show)} />
            <Typography variant="subtitle1">Yearly</Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={3} mt={5}>
        {pricing.map((price, i) => (
          <Grid item xs={12} lg={4} sm={6} key={i}>
            <BlankCard>
              <CardContent sx={{ p: '30px' }}>
                {price.badge ? <StyledChip label="Popular" size="small"></StyledChip> : null}

                <Typography
                  variant="subtitle1"
                  fontSize="12px"
                  mb={3}
                  color="textSecondary"
                  textTransform="uppercase"
                >
                  {price.package}
                </Typography>
                <img src={price.avatar} alt={price.avatar} width={90} />
                <Box my={4}>
                  {price.plan === 'Free' ? (
                    <Box fontSize="50px" mt={5} fontWeight="600">
                      {price.plan}
                    </Box>
                  ) : (
                    <Box display="flex">
                      <Typography variant="h6" mr="8px" mt="-12px">
                        $
                      </Typography>
                      {show ? (
                        <>
                          <Typography fontSize="48px" fontWeight="600">
                            {yearlyPrice(`${price.monthlyplan}`, 12)}
                          </Typography>
                          <Typography
                            fontSize="15px"
                            fontWeight={400}
                            ml={1}
                            color="textSecondary"
                            mt={1}
                          >
                            /yr
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography fontSize="48px" fontWeight="600">
                            {price.monthlyplan}
                          </Typography>
                          <Typography
                            fontSize="15px"
                            fontWeight={400}
                            ml={1}
                            color="textSecondary"
                            mt={1}
                          >
                            /mo
                          </Typography>
                        </>
                      )}
                    </Box>
                  )}
                </Box>

                <Box mt={3}>
                  <List>
                    {price.rules.map((rule, i) => (
                      <Box key={i}>
                        {rule.limit ? (
                          <>
                            <ListItem disableGutters>
                              <ListItemIcon sx={{ color: 'primary.main', minWidth: '32px' }}>
                                <IconCheck width={18} />
                              </ListItemIcon>
                              <ListItemText>{rule.title}</ListItemText>
                            </ListItem>
                          </>
                        ) : (
                          <ListItem disableGutters sx={{ color: 'grey.400' }}>
                            <ListItemIcon sx={{ color: 'grey.400', minWidth: '32px' }}>
                              <IconX width={18} />
                            </ListItemIcon>
                            <ListItemText>{rule.title}</ListItemText>
                          </ListItem>
                        )}
                      </Box>
                    ))}
                  </List>
                </Box>
                {/* <Button
                  sx={{ width: '100%', mt: 3 }}
                  variant="contained"
                  size="large"
                  color="primary"
                >
                  {price.btntext}
                </Button> */}
                {price.plan !== 'Free' && (

                <Button
                  sx={{ width: '100%', mt: 3 }}
                    variant="contained"
                    size="large"
                    color="primary"
                  >

                  <PaystackButton
                  className='paystack-button'
                  text={price.btntext}
                  amount={show ? yearlyPrice(`${price.monthlyplan * 100}`, 12) : price.monthlyplan * 100}
                  {...paystackProps}
                  onSuccess={(response) => {
                    // Concatenate "_yearly" if the yearly button is toggled on
                    const selectedPlan = show ? `${price.package}_yearly` : `${price.package}_monthly`;

                    setSelectedPlan(selectedPlan);
                    handlePaystackSuccess(response, selectedPlan);
                  }}
                >
                </PaystackButton>
              </Button>

                )}

              </CardContent>
            </BlankCard>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
};

export default Pricing;
