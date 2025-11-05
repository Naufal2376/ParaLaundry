"use client";
import React from 'react';

type Period = 'hari' | 'minggu' | 'bulan' | 'tahun';

export default function PeriodSelector({ period }: { period: Period }) {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as Period;
    const url = new URL(window.location.href);
    url.searchParams.set('period', val);
    window.location.href = url.toString();
  };
  return (
    <div>
      <label className="mr-2 text-(--color-dark-primary)">Periode:</label>
      <select
        name="period"
        defaultValue={period}
        className="p-2 border border-(--color-light-primary-active) rounded-lg"
        onChange={onChange}
      >
        <option value="hari">Harian</option>
        <option value="minggu">Mingguan</option>
        <option value="bulan">Bulanan</option>
        <option value="tahun">Tahunan</option>
      </select>
    </div>
  );
}


