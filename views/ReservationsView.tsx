import React, { useState, useMemo } from 'react';
import SectionHeader from '../components/SectionHeader.tsx';
import { MOCK_RESERVATIONS } from '../constants.tsx';
import { Reservation } from '../types.ts';

type ReservationTab = 'Upcoming' | 'Pending' | 'Completed';

const TabButton: React.FC<{ title: string, isActive: boolean, onClick: () => void }> = ({ title, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`relative px-4 sm:px-6 py-3 text-base font-semibold transition-colors duration-200  ${
        isActive
        ? 'text-primary-terra-cotta'
        : 'text-neutral-slate-gray hover:text-neutral-white'
        }`}
    >
        {title}
        {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-terra-cotta animate-fade-in"></div>}
    </button>
);

const ReservationCard: React.FC<{ reservation: Reservation }> = ({ reservation }) => {
    const statusColors = {
        Confirmed: 'border-l-semantic-success',
        Pending: 'border-l-semantic-warning',
        Completed: 'border-l-primary-ocean-blue',
        Cancelled: 'border-l-semantic-error',
    }

    return (
        <div className={`bg-neutral-slate-dark/50 p-4 rounded-lg border border-neutral-slate-gray/20 border-l-4 ${statusColors[reservation.status] || 'border-l-neutral-slate-gray'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-neutral-white">{reservation.service}</p>
                    <p className="text-sm text-neutral-sand-beige/80">with {reservation.clientName}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-neutral-white">{reservation.date}</p>
                    <p className="text-sm text-neutral-slate-gray">{reservation.time}</p>
                </div>
            </div>
             {reservation.status !== 'Cancelled' && <p className="text-right text-semantic-success mt-2 font-bold">{reservation.revenue} MAD</p>}
        </div>
    )
};

const ReservationsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ReservationTab>('Upcoming');

    const filteredReservations = useMemo(() => {
        switch (activeTab) {
            case 'Upcoming':
                return MOCK_RESERVATIONS.filter(r => r.status === 'Confirmed');
            case 'Pending':
                return MOCK_RESERVATIONS.filter(r => r.status === 'Pending');
            case 'Completed':
                 return MOCK_RESERVATIONS.filter(r => r.status === 'Completed' || r.status === 'Cancelled');
            default:
                return [];
        }
    }, [activeTab]);

    return (
        <section id="reservations" className="py-16 sm:py-24 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader title="Manage Reservations" />
                 <p className="-mt-8 mb-8 text-center text-neutral-slate-gray max-w-2xl mx-auto">
                    Review and manage all your bookings in one place.
                </p>

                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-center mb-6 border-b border-neutral-slate-gray/30">
                        <TabButton title="Upcoming" isActive={activeTab === 'Upcoming'} onClick={() => setActiveTab('Upcoming')} />
                        <TabButton title="Pending" isActive={activeTab === 'Pending'} onClick={() => setActiveTab('Pending')} />
                        <TabButton title="Completed" isActive={activeTab === 'Completed'} onClick={() => setActiveTab('Completed')} />
                    </div>

                    <div className="space-y-4">
                        {filteredReservations.length > 0 ? (
                            filteredReservations.map(res => <ReservationCard key={res.id} reservation={res} />)
                        ) : (
                            <div className="text-center text-neutral-slate-gray p-8 border-2 border-dashed border-neutral-slate-gray/30 rounded-2xl">
                                <p>No reservations in this category.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReservationsView;
