import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ language = 'en' }) => {
  const content = {
    en: {
      loading: 'Loading work experience...',
      fetchingData: 'Fetching professional timeline data'
    },
    fr: {
      loading: 'Chargement expérience professionnelle...',
      fetchingData: 'Récupération des données de chronologie professionnelle'
    }
  };

  const skeletonVariants = {
    loading: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const SkeletonCard = ({ isLeft, delay = 0 }) => (
    <motion.div
      className={`relative ${isLeft ? 'pr-8' : 'pl-8'} mb-12`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      {/* Timeline Connector */}
      <div className={`absolute top-6 w-4 h-4 bg-muted rounded-full border-4 border-background z-10 ${
        isLeft ? '-right-2' : '-left-2'
      }`} />

      {/* Card Skeleton */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
        {/* Header Skeleton */}
        <div className={`flex items-center gap-4 mb-4 ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}>
          <motion.div
            className="w-12 h-12 bg-muted rounded-lg"
            variants={skeletonVariants}
            animate="loading"
          />
          <div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'}`}>
            <motion.div
              className="h-5 bg-muted rounded mb-2"
              style={{ width: '70%' }}
              variants={skeletonVariants}
              animate="loading"
            />
            <motion.div
              className="h-4 bg-muted rounded mb-1"
              style={{ width: '50%' }}
              variants={skeletonVariants}
              animate="loading"
            />
            <motion.div
              className="h-3 bg-muted rounded"
              style={{ width: '40%' }}
              variants={skeletonVariants}
              animate="loading"
            />
          </div>
        </div>

        {/* Duration Badge Skeleton */}
        <div className={`flex ${isLeft ? 'justify-end' : 'justify-start'} mb-4`}>
          <motion.div
            className="h-6 bg-muted rounded-full"
            style={{ width: '80px' }}
            variants={skeletonVariants}
            animate="loading"
          />
        </div>

        {/* Technologies Skeleton */}
        <div className="mb-4">
          <motion.div
            className="h-4 bg-muted rounded mb-2"
            style={{ width: '40%' }}
            variants={skeletonVariants}
            animate="loading"
          />
          <div className={`flex flex-wrap gap-2 ${isLeft ? 'justify-end' : 'justify-start'}`}>
            {[1, 2, 3, 4]?.map((i) => (
              <motion.div
                key={i}
                className="h-6 bg-muted rounded"
                style={{ width: `${60 + i * 10}px` }}
                variants={skeletonVariants}
                animate="loading"
              />
            ))}
          </div>
        </div>

        {/* Achievements Skeleton */}
        <div className="mb-4">
          <motion.div
            className="h-4 bg-muted rounded mb-2"
            style={{ width: '35%' }}
            variants={skeletonVariants}
            animate="loading"
          />
          <div className="space-y-2">
            {[1, 2]?.map((i) => (
              <motion.div
                key={i}
                className="h-3 bg-muted rounded"
                style={{ width: `${80 - i * 10}%` }}
                variants={skeletonVariants}
                animate="loading"
              />
            ))}
          </div>
        </div>

        {/* Button Skeleton */}
        <div className={`flex ${isLeft ? 'justify-end' : 'justify-start'}`}>
          <motion.div
            className="h-8 bg-muted rounded"
            style={{ width: '100px' }}
            variants={skeletonVariants}
            animate="loading"
          />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Loading Header */}
      <div className="text-center py-12">
        <motion.div
          className="inline-flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span className="text-foreground font-medium">{content?.[language]?.loading}</span>
        </motion.div>
        <p className="text-muted-foreground mt-2 text-sm">
          {content?.[language]?.fetchingData}
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Timeline Skeleton */}
          <div className="lg:col-span-3">
            <div className="relative">
              {/* Timeline Line Skeleton */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-px">
                <motion.div
                  className="w-full bg-muted opacity-30"
                  style={{ height: '100%' }}
                  variants={skeletonVariants}
                  animate="loading"
                />
              </div>

              {/* Timeline Cards Skeleton */}
              <div className="relative z-10">
                {[0, 1, 2, 3, 4]?.map((index) => (
                  <SkeletonCard
                    key={index}
                    isLeft={index % 2 === 0}
                    delay={index * 0.2}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-card border border-border rounded-xl p-6 sticky top-24"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* Header Skeleton */}
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  className="h-6 bg-muted rounded"
                  style={{ width: '60%' }}
                  variants={skeletonVariants}
                  animate="loading"
                />
              </div>

              {/* Search Skeleton */}
              <motion.div
                className="h-10 bg-muted rounded mb-4"
                variants={skeletonVariants}
                animate="loading"
              />

              {/* Filter Items Skeleton */}
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6]?.map((i) => (
                  <motion.div
                    key={i}
                    className="p-3 bg-muted/30 rounded-lg"
                    variants={skeletonVariants}
                    animate="loading"
                  >
                    <motion.div
                      className="h-4 bg-muted rounded mb-1"
                      style={{ width: `${60 + i * 5}%` }}
                      variants={skeletonVariants}
                      animate="loading"
                    />
                    <motion.div
                      className="h-3 bg-muted rounded"
                      style={{ width: '40%' }}
                      variants={skeletonVariants}
                      animate="loading"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;