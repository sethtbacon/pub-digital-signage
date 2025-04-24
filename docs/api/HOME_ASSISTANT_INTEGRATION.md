# Home Assistant Integration Guide

This guide explains how we'll connect your pub digital signage to your Home Assistant smart home system.

## Overview

The integration will allow:
1. Controlling the digital signage display through Home Assistant
2. Triggering content changes based on events in your home
3. Using presence detection for visitor tracking
4. Time-based automations for changing display themes

## Integration Method

We'll use the Home Assistant REST API to create a bidirectional connection:

1. **Digital Signage → Home Assistant**: 
   - The signage system will register as a device in Home Assistant
   - It will report status and allow control through the Home Assistant interface

2. **Home Assistant → Digital Signage**:
   - Home Assistant will trigger content changes and special displays
   - Automations in Home Assistant can control signage behavior

## Setup Process

### Step 1: Create a Long-Lived Access Token in Home Assistant
- Go to your Home Assistant profile
- Scroll to the bottom to find "Long-Lived Access Tokens"
- Create a token specifically for the pub digital signage
- Save this token securely (we'll use it in our configuration)

### Step 2: Configure the Digital Signage as a Device
- Register the digital signage in Home Assistant's configuration
- Make the signage appear as a media device with controls

### Step 3: Create API Endpoints in Our Application
- Implement status reporting endpoints
- Add control endpoints for content switching
- Build webhook receivers for event notifications

### Step 4: Set Up Automations in Home Assistant
Examples of automations we can set up:
- Change to evening theme when specific lights are turned on
- Display welcome message when certain people arrive home
- Show special content during parties (detected by multiple guests or specific conditions)
- Automatically turn off displays during quiet hours

## Display Control Entities

We'll create the following entities in Home Assistant:

1. **Media Player Entity**
   - On/Off control for the display
   - Content selection
   - Volume control (if applicable)

2. **Sensor Entities**
   - Current display content
   - System status
   - Visitor count

3. **Service Calls**
   - Switch to specific content
   - Trigger special displays
   - Update leaderboards

## Alternative: QR Code for Apple Photos Album

As you suggested, we can also implement a simpler approach for user-generated photos:

1. Create a shared Apple Photos Album for pub photos
2. Generate a QR code that links directly to this album
3. Display the QR code periodically on the digital signage
4. Visitors can scan the code to view and add photos

This approach is simpler than building our own upload system, though it would limit some functionality (like displaying the photos directly on the signage in a controlled manner).

We can implement both approaches:
- QR link to Apple Photos for easy sharing
- Direct integration for displaying selected photos on the sign

## Initial Implementation Plan

1. First, implement basic REST API client in our application
2. Configure authentication using the long-lived token
3. Create simple sensor entity to report status to Home Assistant
4. Gradually add more sophisticated controls and automations