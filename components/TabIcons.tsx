import React from 'react';
import { IconSymbol } from './ui/IconSymbol';

export function HomeIcon({ color }: { color: string }) {
  return <IconSymbol size={28} name="house.fill" color={color} />;
}

export function ExperientiaIcon({ color }: { color: string }) {
  return <IconSymbol size={28} name="paperplane.fill" color={color} />;
}

export function CampusBuzzIcon({ color }: { color: string }) {
  return <IconSymbol size={28} name="megaphone.fill" color={color} />;
}

export function NetworkingIcon({ color }: { color: string }) {
  return <IconSymbol size={28} name="person.2.fill" color={color} />;
}

export function ProfileIcon({ color }: { color: string }) {
  return <IconSymbol size={28} name="person.fill" color={color} />;
}
