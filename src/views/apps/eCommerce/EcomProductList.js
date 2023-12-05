import React from 'react';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../components/container/PageContainer';
import ProductTableList from 'src/components/apps/ecommerce/ProductTableList/ProductTableList';
import BlankCard from '../../../components/shared/BlankCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Shop',
  },
];

const EcomProductList = () => {
  return (
    <PageContainer title="Product List" description="this is prouduct List page">
      {/* breadcrumb */}
      <Breadcrumb title="Product-List" items={BCrumb} />
      <BlankCard>
        {/* ------------------------------------------- */}
        {/* Left part */}
        {/* ------------------------------------------- */}
        <ProductTableList />
      </BlankCard>
    </PageContainer>
  );
};

export default EcomProductList;
