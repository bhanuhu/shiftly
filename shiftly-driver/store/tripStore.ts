import { create } from 'zustand';
import { Trip, IncomingJob, TripStatus } from '../types';
import { DUMMY_INCOMING_JOB, DUMMY_SHARED_JOB } from '../data/dummy';
import { apiClient } from '../services/api';

interface TripStore {
  currentTrips: Trip[];
  incomingJob: IncomingJob | null;
  sharedJob: IncomingJob | null;
  showSharedJob: boolean;
  isLoading: boolean;
  setIncomingJob: (job: IncomingJob | null) => void;
  acceptJob: (job: IncomingJob, trip: Trip) => void;
  rejectJob: () => void;
  acceptSharedJob: (job: IncomingJob, trip: Trip) => void;
  declineSharedJob: () => void;
  updateTripStatus: (tripId: string, status: TripStatus) => void;
  completeTrip: (tripId: string) => void;
  loadDummyIncomingJob: () => void;
  clearIncomingJob: () => void;
}

export const useTripStore = create<TripStore>((set, get) => ({
  currentTrips: [],
  incomingJob: null,
  sharedJob: null,
  showSharedJob: false,
  isLoading: false,
  setIncomingJob: (job) => set({ incomingJob: job }),
  acceptJob: (job, trip) =>
    set((state) => {
      apiClient.acceptBooking(job.id).catch(() => undefined);
      return {
        currentTrips: [...state.currentTrips, trip],
        incomingJob: null,
      };
    }),
  rejectJob: () =>
    set((state) => {
      if (state.incomingJob) {
        apiClient.rejectBooking(state.incomingJob.id).catch(() => undefined);
      }
      return { incomingJob: null };
    }),
  acceptSharedJob: (job, trip) =>
    set((state) => ({
      currentTrips: [...state.currentTrips, trip],
      sharedJob: null,
      showSharedJob: false,
    })),
  declineSharedJob: () =>
    set({
      sharedJob: null,
      showSharedJob: false,
    }),
  updateTripStatus: (tripId, status) =>
    set((state) => ({
      currentTrips: state.currentTrips.map((t) =>
        t.id === tripId ? { ...t, status } : t
      ),
    })),
  completeTrip: (tripId) =>
    set((state) => ({
      currentTrips: state.currentTrips.filter((t) => t.id !== tripId),
    })),
  loadDummyIncomingJob: () =>
    set({ incomingJob: DUMMY_INCOMING_JOB }),
  clearIncomingJob: () => set({ incomingJob: null }),
}));
