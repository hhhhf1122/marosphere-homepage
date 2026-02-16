import React from 'react';
import SectionHeader from '../components/SectionHeader.tsx';
import { ProviderView } from '../types.ts';

const ProviderWidget: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
    <div className={`bg-neutral-slate-dark/40 backdrop-blur-sm p-6 rounded-2xl border border-neutral-slate-gray/20 shadow-lg ${className}`}>
        <h3 className="text-lg font-semibold text-primary-terra-cotta tracking-wide mb-3">{title}</h3>
        <div className="text-neutral-sand-beige/90">{children}</div>
    </div>
);

const StatCard: React.FC<{ title: string, value: string, change?: string, positive?: boolean }> = ({ title, value, change, positive }) => (
    <div className="bg-neutral-slate-dark/60 p-4 rounded-lg border border-neutral-slate-gray/20">
        <p className="text-sm text-neutral-slate-gray">{title}</p>
        <p className="text-2xl font-bold text-neutral-white">{value}</p>
        {change && <p className={`text-sm font-semibold ${positive ? 'text-semantic-success' : 'text-semantic-error'}`}>{change}</p>}
    </div>
);

interface ProviderPortalViewProps {
    onNavigate: (view: ProviderView) => void;
}

const ProviderPortalView: React.FC<ProviderPortalViewProps> = ({ onNavigate }) => {
    return (
        <section id="provider-portal" className="py-16 sm:py-24 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader title="Provider Dashboard" />
                <p className="-mt-8 mb-8 text-center text-neutral-slate-gray max-w-2xl mx-auto">
                    Manage your services and connect with travelers.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Verification Widget */}
                    <div className="md:col-span-2 lg:col-span-4 bg-gradient-to-r from-primary-terra-cotta/20 to-primary-terra-cotta/10 p-6 rounded-2xl border border-primary-terra-cotta/50 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-neutral-white">Complete Your Verification</h3>
                            <p className="text-primary-terra-cotta/80">Unlock traveler trust and get more bookings by becoming a MarocSphere Verified Partner.</p>
                        </div>
                        <button onClick={() => onNavigate('certification')} className="bg-primary-terra-cotta text-neutral-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap">
                            Get Verified
                        </button>
                    </div>

                    {/* Stat Cards */}
                    <StatCard title="Today's Earnings" value="2,500 MAD" change="+15%" positive={true} />
                    <StatCard title="Pending Payout" value="12,800 MAD" />
                    <StatCard title="New Messages" value="3" />
                    <StatCard title="Profile Views" value="1,204" change="-2.5%" positive={false}/>

                    {/* Upcoming Bookings */}
                    <ProviderWidget title="Upcoming Bookings" className="lg:col-span-2">
                        <div className="space-y-3">
                            <p><span className="font-semibold text-neutral-white">9:00 AM:</span> Medina Historical Tour - Alice J.</p>
                            <p><span className="font-semibold text-neutral-white">2:00 PM:</span> Private Leather Workshop - Robert S.</p>
                            <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('reservations')}} className="text-primary-terra-cotta hover:underline mt-2 inline-block">View all reservations →</a>
                        </div>
                    </ProviderWidget>

                    {/* Performance Overview */}
                     <ProviderWidget title="Performance This Week" className="lg:col-span-2">
                        <div className="h-40 flex items-end space-x-2">
                            {/* Simplified bar chart */}
                            <div className="flex-1 h-[60%] bg-neutral-slate-gray/40 rounded-t-sm" title="Monday: 1800 MAD"></div>
                            <div className="flex-1 h-[80%] bg-neutral-slate-gray/40 rounded-t-sm" title="Tuesday: 2800 MAD"></div>
                            <div className="flex-1 h-[50%] bg-neutral-slate-gray/40 rounded-t-sm" title="Wednesday: 1500 MAD"></div>
                            <div className="flex-1 h-[75%] bg-neutral-slate-gray/40 rounded-t-sm" title="Thursday: 2600 MAD"></div>
                            <div className="flex-1 h-[90%] bg-primary-terra-cotta rounded-t-sm" title="Friday (Today): 3100 MAD"></div>
                            <div className="flex-1 h-[40%] bg-neutral-slate-dark/50 rounded-t-sm" title="Saturday (Est.)"></div>
                            <div className="flex-1 h-[30%] bg-neutral-slate-dark/50 rounded-t-sm" title="Sunday (Est.)"></div>
                        </div>
                         <p className="text-xs text-center text-neutral-slate-gray mt-1">Weekly Earnings (MAD)</p>
                    </ProviderWidget>
                </div>
            </div>
        </section>
    );
};

export default ProviderPortalView;
