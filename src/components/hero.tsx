"use client";

import React from "react";

export default function Hero({
  subtitle,
  title,
}: {
  subtitle?: string;
  title?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
