var routesDefaultFHIR = function(app, DefaultFHIR){
	//get
	app.get('/:apikey/identity-assuranceLevel/:_id?', DefaultFHIR.get.identityAssuranceLevel);
	app.get('/:apikey/identity-assuranceLevel/code/:code?', DefaultFHIR.get.identityAssuranceLevelCode);
	app.get('/:apikey/administrative-gender/:_id?', DefaultFHIR.get.administrativeGender);
	app.get('/:apikey/administrative-gender/code/:code?', DefaultFHIR.get.administrativeGenderCode);
	app.get('/:apikey/marital-status/:_id?', DefaultFHIR.get.maritalStatus);
	app.get('/:apikey/marital-status/code/:code?', DefaultFHIR.get.maritalStatusCode);
	app.get('/:apikey/contact-role/:_id?', DefaultFHIR.get.contactRole);
	app.get('/:apikey/contact-role/code/:code?', DefaultFHIR.get.contactRoleCode);
	app.get('/:apikey/animal-species/:_id?', DefaultFHIR.get.animalSpecies);
	app.get('/:apikey/animal-species/code/:code?', DefaultFHIR.get.animalSpeciesCode);
	app.get('/:apikey/animal-breeds/:_id?', DefaultFHIR.get.animalBreeds);
	app.get('/:apikey/animal-breeds/code/:code?', DefaultFHIR.get.animalBreedsCode);
	app.get('/:apikey/animal-genderstatus/:_id?', DefaultFHIR.get.animalGenderStatus);
	app.get('/:apikey/animal-genderstatus/code/:code?', DefaultFHIR.get.animalGenderStatusCode);
	app.get('/:apikey/languages/:_id?', DefaultFHIR.get.languages);
	app.get('/:apikey/languages/code/:code?', DefaultFHIR.get.languagesCode);
	app.get('/:apikey/link-type/:_id?', DefaultFHIR.get.linkType);
	app.get('/:apikey/link-type/code/:code?', DefaultFHIR.get.linkTypeCode);
	app.get('/:apikey/relatedperson-relationshiptype/:_id?', DefaultFHIR.get.relatedPersonRelationshipType);
	app.get('/:apikey/relatedperson-relationshiptype/code/:code?', DefaultFHIR.get.relatedPersonRelationshipTypeCode);
	app.get('/:apikey/group-type/:_id?', DefaultFHIR.get.groupType);
	app.get('/:apikey/group-type/code/:code?', DefaultFHIR.get.groupTypeCode);
	app.get('/:apikey/identifier-use/:_id?', DefaultFHIR.get.identifierUse);
	app.get('/:apikey/identifier-use/code/:code?', DefaultFHIR.get.identifierUseCode);
	app.get('/:apikey/identifier-type/:_id?', DefaultFHIR.get.identifierType);
	app.get('/:apikey/identifier-type/code/:code?', DefaultFHIR.get.identifierTypeCode);
	app.get('/:apikey/name-use/:_id?', DefaultFHIR.get.nameUse);
	app.get('/:apikey/name-use/code/:code?', DefaultFHIR.get.nameUseCode);
	app.get('/:apikey/contact-point-system/:_id?', DefaultFHIR.get.contactPointSystem);
	app.get('/:apikey/contact-point-system/code/:code?', DefaultFHIR.get.contactPointSystemCode);
	app.get('/:apikey/contact-point-use/:_id?', DefaultFHIR.get.contactPointUse);
	app.get('/:apikey/contact-point-use/code/:code?', DefaultFHIR.get.contactPointUseCode);
	app.get('/:apikey/address-use/:_id?', DefaultFHIR.get.addressUse);
	app.get('/:apikey/address-use/code/:code?', DefaultFHIR.get.addressUseCode);
	app.get('/:apikey/address-type/:_id?', DefaultFHIR.get.addressType);
	app.get('/:apikey/address-type/code/:code?', DefaultFHIR.get.addressTypeCode);
	app.get('/:apikey/appointment-reason-code/:_id?', DefaultFHIR.get.appointmentReasonCode);
	app.get('/:apikey/appointment-reason-code/code/:code?', DefaultFHIR.get.appointmentReasonCodeCode);
	app.get('/:apikey/slot-status/:_id?', DefaultFHIR.get.slotStatus);
	app.get('/:apikey/slot-status/code/:code?', DefaultFHIR.get.slotStatusCode);
	app.get('/:apikey/appointment-status/:_id?', DefaultFHIR.get.appointmentStatus);
	app.get('/:apikey/appointment-status/code/:code?', DefaultFHIR.get.appointmentStatusCode);
	app.get('/:apikey/participant-required/:_id?', DefaultFHIR.get.participantRequired);
	app.get('/:apikey/participant-required/code/:code?', DefaultFHIR.get.participantRequiredCode);
	app.get('/:apikey/participation-status/:_id?', DefaultFHIR.get.participationStatus);
	app.get('/:apikey/participation-status/code/:code?', DefaultFHIR.get.participationStatusCode);
	app.get('/:apikey/act-encounter-code/:_id?', DefaultFHIR.get.actEncounterCode);
	app.get('/:apikey/act-encounter-code/code/:code?', DefaultFHIR.get.actEncounterCodeCode);
	app.get('/:apikey/act-priority/:_id?', DefaultFHIR.get.actPriority);
	app.get('/:apikey/act-priority/code/:code?', DefaultFHIR.get.actPriorityCode);
	app.get('/:apikey/account-status/:_id?', DefaultFHIR.get.accountStatus);
	app.get('/:apikey/account-status/code/:code?', DefaultFHIR.get.accountStatusCode);
	app.get('/:apikey/account-type/:_id?', DefaultFHIR.get.accountType);
	app.get('/:apikey/account-type/code/:code?', DefaultFHIR.get.accountTypeCode);
	app.get('/:apikey/diagnosis-role/:_id?', DefaultFHIR.get.diagnosisRole);
	app.get('/:apikey/diagnosis-role/code/:code?', DefaultFHIR.get.diagnosisRoleCode);
	app.get('/:apikey/encounter-admit-source/:_id?', DefaultFHIR.get.encounterAdmitSource);
	app.get('/:apikey/encounter-admit-source/code/:code?', DefaultFHIR.get.encounterAdmitSourceCode);
	app.get('/:apikey/encounter-diet/:_id?', DefaultFHIR.get.encounterDiet);
	app.get('/:apikey/encounter-diet/code/:code?', DefaultFHIR.get.encounterDietCode);
	app.get('/:apikey/encounter-discharge-disposition/:_id?', DefaultFHIR.get.encounterDischargeDisposition);
	app.get('/:apikey/encounter-discharge-disposition/code/:code?', DefaultFHIR.get.encounterDischargeDispositionCode);
	app.get('/:apikey/encounter-location-status/:_id?', DefaultFHIR.get.encounterLocationStatus);
	app.get('/:apikey/encounter-location-status/code/:code?', DefaultFHIR.get.encounterLocationStatusCode);
	app.get('/:apikey/encounter-participant-type/:_id?', DefaultFHIR.get.encounterParticipantType);
	app.get('/:apikey/encounter-participant-type/code/:code?', DefaultFHIR.get.encounterParticipantTypeCode);
	app.get('/:apikey/encounter-participant_type/:_id?', DefaultFHIR.get.encounterParticipantType);
	app.get('/:apikey/encounter-participant_type/code/:code?', DefaultFHIR.get.encounterParticipantTypeCode);
	app.get('/:apikey/encounter-reason/:_id?', DefaultFHIR.get.encounterReason);
	app.get('/:apikey/encounter-reason/code/:code?', DefaultFHIR.get.encounterReasonCode);
	app.get('/:apikey/encounter-special-courtesy/:_id?', DefaultFHIR.get.encounterSpecialCourtesy);
	app.get('/:apikey/encounter-special-courtesy/code/:code?', DefaultFHIR.get.encounterSpecialCourtesyCode);
	app.get('/:apikey/encounter-special-arrangements/:_id?', DefaultFHIR.get.encounterSpecialArrangements);
	app.get('/:apikey/encounter-special-arrangements/code/:code?', DefaultFHIR.get.encounterSpecialArrangementsCode);
	app.get('/:apikey/encounter-status/:_id?', DefaultFHIR.get.encounterStatus);
	app.get('/:apikey/encounter-status/code/:code?', DefaultFHIR.get.encounterStatusCode);
	app.get('/:apikey/encounter-type/:_id?', DefaultFHIR.get.encounterType);
	app.get('/:apikey/encounter-type/code/:code?', DefaultFHIR.get.encounterTypeCode);
	app.get('/:apikey/episode-of-care-type/:_id?', DefaultFHIR.get.episodeOfCareType);
	app.get('/:apikey/episode-of-care-type/code/:code?', DefaultFHIR.get.episodeOfCareTypeCode);
	app.get('/:apikey/episode-of-care-status/:_id?', DefaultFHIR.get.episodeOfCareStatus);
	app.get('/:apikey/episode-of-care-status/code/:code?', DefaultFHIR.get.episodeOfCareStatusCode);
	app.get('/:apikey/flag-status/:_id?', DefaultFHIR.get.flagStatus);
	app.get('/:apikey/flag-status/code/:code?', DefaultFHIR.get.flagStatusCode);
	app.get('/:apikey/flag-category/:_id?', DefaultFHIR.get.flagCategory);
	app.get('/:apikey/flag-category/code/:code?', DefaultFHIR.get.flagCategoryCode);
	app.get('/:apikey/flag-code/:_id?', DefaultFHIR.get.flagCode);
	app.get('/:apikey/flag-code/code/:code?', DefaultFHIR.get.flagCodeCode);
	app.get('/:apikey/re-admission-indicator/:_id?', DefaultFHIR.get.reAdmissionIndicator);
	app.get('/:apikey/re-admission-indicator/code/:code?', DefaultFHIR.get.reAdmissionIndicatorCode);
	app.get('/:apikey/udi-entry-type/:_id?', DefaultFHIR.get.udiEntryType);
	app.get('/:apikey/udi-entry-type/code/:code?', DefaultFHIR.get.udiEntryTypeCode);
	app.get('/:apikey/device-status/:_id?', DefaultFHIR.get.deviceStatus);
	app.get('/:apikey/device-status/code/:code?', DefaultFHIR.get.deviceStatusCode);
	app.get('/:apikey/device-kind/:_id?', DefaultFHIR.get.deviceKind);
	app.get('/:apikey/device-kind/code/:code?', DefaultFHIR.get.deviceKindCode);
	app.get('/:apikey/device-safety/:_id?', DefaultFHIR.get.deviceSafety);
	app.get('/:apikey/device-safety/code/:code?', DefaultFHIR.get.deviceSafetyCode);
	app.get('/:apikey/operational-status/:_id?', DefaultFHIR.get.operationalStatus);
	app.get('/:apikey/operational-status/code/:code?', DefaultFHIR.get.operationalStatusCode);
	app.get('/:apikey/device-metric-type/:_id?', DefaultFHIR.get.deviceMetricType);
	app.get('/:apikey/device-metric-type/code/:code?', DefaultFHIR.get.deviceMetricTypeCode);
	app.get('/:apikey/metric-color/:_id?', DefaultFHIR.get.metricColor);
	app.get('/:apikey/metric-color/code/:code?', DefaultFHIR.get.metricColorCode);
	app.get('/:apikey/metric-category/:_id?', DefaultFHIR.get.metricCategory);
	app.get('/:apikey/metric-category/code/:code?', DefaultFHIR.get.metricCategoryCode);
	app.get('/:apikey/metric-calibration-type/:_id?', DefaultFHIR.get.metricCalibrationType);
	app.get('/:apikey/metric-calibration-type/code/:code?', DefaultFHIR.get.metricCalibrationTypeCode);
	app.get('/:apikey/metric-calibration-state/:_id?', DefaultFHIR.get.metricCalibrationState);
	app.get('/:apikey/metric-calibration-state/code/:code?', DefaultFHIR.get.metricCalibrationStateCode);
	app.get('/:apikey/substance-status/:_id?', DefaultFHIR.get.substanceStatus);
	app.get('/:apikey/substance-status/code/:code?', DefaultFHIR.get.substanceStatusCode);
	app.get('/:apikey/substance-category/:_id?', DefaultFHIR.get.substanceCategory);
	app.get('/:apikey/substance-category/code/:code?', DefaultFHIR.get.substanceCategoryCode);
	app.get('/:apikey/substance-code/:_id?', DefaultFHIR.get.substanceCode);
	app.get('/:apikey/substance-code/code/:code?', DefaultFHIR.get.substanceCodeCode);
	// Service Provider Directory Resources, by : hardika cs(start)
	app.get('/:apikey/organization-type/:_id?', DefaultFHIR.get.organizationType);
	app.get('/:apikey/organization-type/code/:code?', DefaultFHIR.get.organizationTypeCode);
	app.get('/:apikey/contactentity-type/:_id?', DefaultFHIR.get.contactentityType);
	app.get('/:apikey/contactentity-type/code/:code?', DefaultFHIR.get.contactentityTypeCode);
	app.get('/:apikey/location-status/:_id?', DefaultFHIR.get.locationStatus);
	app.get('/:apikey/location-status/code/:code?', DefaultFHIR.get.locationStatusCode);
	app.get('/:apikey/bed-status/:_id?', DefaultFHIR.get.bedStatus);
	app.get('/:apikey/bed-status/code/:code?', DefaultFHIR.get.bedStatusCode);
	app.get('/:apikey/location-mode/:_id?', DefaultFHIR.get.locationMode);
	app.get('/:apikey/location-mode/code/:code?', DefaultFHIR.get.locationModeCode);
	app.get('/:apikey/service-delivery-location-role-type/:_id?', DefaultFHIR.get.serviceDeliveryLocationRoleType);
	app.get('/:apikey/service-delivery-location-role-type/code/:code?', DefaultFHIR.get.serviceDeliveryLocationRoleType);
	app.get('/:apikey/location-physical-type/:_id?', DefaultFHIR.get.locationPhysicalType);
	app.get('/:apikey/location-physical-type/code/:code?', DefaultFHIR.get.locationPhysicalTypeCode);
	app.get('/:apikey/qualification-code/:_id?', DefaultFHIR.get.qualificationCode);
	app.get('/:apikey/qualification-code/code/:code?', DefaultFHIR.get.qualificationCodeCode);
	app.get('/:apikey/practitioner-role-code/:_id?', DefaultFHIR.get.practitionerRoleCode);
	app.get('/:apikey/practitioner-role-code/code/:code?', DefaultFHIR.get.practitionerRoleCodeCode);
	app.get('/:apikey/practice-code/:_id?', DefaultFHIR.get.practiceCode);
	app.get('/:apikey/practice-code/code/:code?', DefaultFHIR.get.practiceCodeCode);
	app.get('/:apikey/days-of-week/:_id?', DefaultFHIR.get.daysOfWeek);
	app.get('/:apikey/days-of-week/code/:code?', DefaultFHIR.get.daysOfWeekCode);
	app.get('/:apikey/service-category/:_id?', DefaultFHIR.get.serviceCategory);
	app.get('/:apikey/service-category/code/:code?', DefaultFHIR.get.serviceCategoryCode);
	app.get('/:apikey/service-type/:_id?', DefaultFHIR.get.serviceType);
	app.get('/:apikey/service-type/code/:code?', DefaultFHIR.get.serviceTypeCode);
	app.get('/:apikey/service-provision-conditions/:_id?', DefaultFHIR.get.serviceProvisionConditions);
	app.get('/:apikey/service-provision-conditions/code/:code?', DefaultFHIR.get.serviceProvisionConditionsCode);
	app.get('/:apikey/service-referral-method/:_id?', DefaultFHIR.get.serviceReferralMethod);
	app.get('/:apikey/service-referral-method/code/:code?', DefaultFHIR.get.serviceReferralMethodCode);
	app.get('/:apikey/endpoint-status/:_id?', DefaultFHIR.get.endpointStatus);
	app.get('/:apikey/endpoint-status/code/:code?', DefaultFHIR.get.endpointStatusCode);
	app.get('/:apikey/endpoint-connection-type/:_id?', DefaultFHIR.get.endpointConnectionType);
	app.get('/:apikey/endpoint-connection-type/code/:code?', DefaultFHIR.get.endpointConnectionTypeCode);
	app.get('/:apikey/endpoint-payload-type/:_id?', DefaultFHIR.get.endpointPayloadType);
	app.get('/:apikey/endpoint-payload-type/code/:code?', DefaultFHIR.get.endpointPayloadTypeCode);
	// Service Provider Directory Resources, by : hardika cs(end)

	//post method
	app.post('/:apikey/identity-assuranceLevel', DefaultFHIR.post.identityAssuranceLevel);
	app.post('/:apikey/administrative-gender', DefaultFHIR.post.administrativeGender);
	app.post('/:apikey/marital-status', DefaultFHIR.post.maritalStatus);
	app.post('/:apikey/contact-role', DefaultFHIR.post.contactRole);
	app.post('/:apikey/animal-species', DefaultFHIR.post.animalSpecies);
	app.post('/:apikey/animal-breeds', DefaultFHIR.post.animalBreeds);
	app.post('/:apikey/animal-genderstatus', DefaultFHIR.post.animalGenderStatus);
	app.post('/:apikey/languages', DefaultFHIR.post.languages);
	app.post('/:apikey/link-type', DefaultFHIR.post.linkType);
	app.post('/:apikey/relatedperson-relationshiptype', DefaultFHIR.post.relatedPersonRelationshipType);
	app.post('/:apikey/group-type', DefaultFHIR.post.groupType);
	app.post('/:apikey/identifier-use', DefaultFHIR.post.identifierUse);
	app.post('/:apikey/identifier-type', DefaultFHIR.post.identifierType);
	app.post('/:apikey/name-use', DefaultFHIR.post.nameUse);
	app.post('/:apikey/contact-point-system', DefaultFHIR.post.contactPointSystem);
	app.post('/:apikey/contact-point-use', DefaultFHIR.post.contactPointUse);
	app.post('/:apikey/address-use', DefaultFHIR.post.addressUse);
	app.post('/:apikey/address-type', DefaultFHIR.post.addressType);
	app.post('/:apikey/appointment-reason-code', DefaultFHIR.post.appointmentReasonCode);
	app.post('/:apikey/slot-status', DefaultFHIR.post.slotStatus);
	app.post('/:apikey/appointment-status', DefaultFHIR.post.appointmentStatus);
	app.post('/:apikey/participant-required', DefaultFHIR.post.participantRequired);
	app.post('/:apikey/participation-status', DefaultFHIR.post.participationStatus);
	app.post('/:apikey/act-encounter-code', DefaultFHIR.post.actEncounterCode);	
	app.post('/:apikey/act-priority', DefaultFHIR.post.actPriority);	
	app.post('/:apikey/account-status', DefaultFHIR.post.accountStatus);	
	app.post('/:apikey/account-type', DefaultFHIR.post.accountType);	
	app.post('/:apikey/diagnosis-role', DefaultFHIR.post.diagnosisRole);	
	app.post('/:apikey/encounter-admit-source', DefaultFHIR.post.encounterAdmitSource);
	app.post('/:apikey/encounter-diet', DefaultFHIR.post.encounterDiet);
	app.post('/:apikey/encounter-discharge-disposition', DefaultFHIR.post.encounterDischargeDisposition);	
	app.post('/:apikey/encounter-location-status', DefaultFHIR.post.encounterLocationStatus);	
	app.post('/:apikey/encounter-participant-type', DefaultFHIR.post.encounterParticipantType);	
	app.post('/:apikey/encounter-reason', DefaultFHIR.post.encounterReason);	
	app.post('/:apikey/encounter-special-courtesy', DefaultFHIR.post.encounterSpecialCourtesy);
	app.post('/:apikey/encounter-special-arrangements', DefaultFHIR.post.encounterSpecialArrangements);
	app.post('/:apikey/encounter-status', DefaultFHIR.post.encounterStatus);	
	app.post('/:apikey/encounter-type', DefaultFHIR.post.encounterType);	
	app.post('/:apikey/episode-of-care-type', DefaultFHIR.post.episodeOfCareType);	
	app.post('/:apikey/episode-of-care-status', DefaultFHIR.post.episodeOfCareStatus);	
	app.post('/:apikey/flag-status', DefaultFHIR.post.flagStatus);	
	app.post('/:apikey/flag-category', DefaultFHIR.post.flagCategory);
	app.post('/:apikey/flag-code', DefaultFHIR.post.flagCode);	
	app.post('/:apikey/re-admission-indicator', DefaultFHIR.post.reAdmissionIndicator);	
	app.post('/:apikey/udi-entry-type', DefaultFHIR.post.udiEntryType);
	app.post('/:apikey/device-status', DefaultFHIR.post.deviceStatus);
	app.post('/:apikey/device-kind', DefaultFHIR.post.deviceKind);
	app.post('/:apikey/device-safety', DefaultFHIR.post.deviceSafety);
	app.post('/:apikey/operational-status', DefaultFHIR.post.operationalStatus);
	app.post('/:apikey/parameter-group', DefaultFHIR.post.parameterGroup);
	app.post('/:apikey/measurement-principle', DefaultFHIR.post.measurementPrinciple);
	app.post('/:apikey/specification-type', DefaultFHIR.post.specificationType);
	app.post('/:apikey/metric-operational-status', DefaultFHIR.post.metricOperationalStatus);
	app.post('/:apikey/device-metric-type', DefaultFHIR.post.deviceMetricType);
	app.post('/:apikey/metric-color', DefaultFHIR.post.metricColor);
	app.post('/:apikey/metric-category', DefaultFHIR.post.metricCategory);
	app.post('/:apikey/metric-calibration-type', DefaultFHIR.post.metricCalibrationType);
	app.post('/:apikey/metric-calibration-state', DefaultFHIR.post.metricCalibrationState);
	app.post('/:apikey/substance-status', DefaultFHIR.post.substanceStatus);
	app.post('/:apikey/substance-category', DefaultFHIR.post.substanceCategory);
	app.post('/:apikey/substance-code', DefaultFHIR.post.substanceCode);
	// Service Provider Directory Resources, by : hardika cs(start)
	app.post('/:apikey/organization-type', DefaultFHIR.post.organizationType);
	app.post('/:apikey/contact-entity-type', DefaultFHIR.post.contactentityType);
	app.post('/:apikey/location-status', DefaultFHIR.post.locationStatus);
	app.post('/:apikey/bed-status', DefaultFHIR.post.bedStatus);
	app.post('/:apikey/location-mode', DefaultFHIR.post.locationMode);
	app.post('/:apikey/service-delivery-location-role-type', DefaultFHIR.post.serviceDeliveryLocationRoleType);
	app.post('/:apikey/location-physical-type', DefaultFHIR.post.locationPhysicalType);
	app.post('/:apikey/qualification-code', DefaultFHIR.post.qualificationCode);
	app.post('/:apikey/practitioner-role-code', DefaultFHIR.post.practitionerRoleCode);
	app.post('/:apikey/practice-code', DefaultFHIR.post.practiceCode);
	app.post('/:apikey/days-of-week', DefaultFHIR.post.daysOfWeek);
	app.post('/:apikey/service-category', DefaultFHIR.post.serviceCategory);
	app.post('/:apikey/service-type', DefaultFHIR.post.serviceType);
	app.post('/:apikey/service-provision-conditions', DefaultFHIR.post.serviceProvisionConditions);
	app.post('/:apikey/service-referral-method', DefaultFHIR.post.serviceReferralMethod);
	app.post('/:apikey/endpoint-status', DefaultFHIR.post.endpointStatus);
	app.post('/:apikey/endpoint-connection-type', DefaultFHIR.post.endpointConnectionType);
	app.post('/:apikey/endpoint-payload-type', DefaultFHIR.post.endpointPayloadType);
	// Service Provider Directory Resources, by : hardika cs(end)


	//put method
	app.put('/:apikey/identity-assuranceLevel/:_id?', DefaultFHIR.put.identityAssuranceLevel);
	app.put('/:apikey/administrative-gender/:_id?', DefaultFHIR.put.administrativeGender);
	app.put('/:apikey/marital-status/:_id?', DefaultFHIR.put.maritalStatus);
	app.put('/:apikey/contact-role/:_id?', DefaultFHIR.put.contactRole);
	app.put('/:apikey/animal-species/:_id?', DefaultFHIR.put.animalSpecies);
	app.put('/:apikey/animal-breeds/:_id?', DefaultFHIR.put.animalBreeds);
	app.put('/:apikey/animal-genderstatus/:_id?', DefaultFHIR.put.animalGenderStatus);
	app.put('/:apikey/languages/:_id?', DefaultFHIR.put.languages);
	app.put('/:apikey/link-type/:_id?', DefaultFHIR.put.linkType);
	app.put('/:apikey/relatedperson-relationshiptype/:_id?', DefaultFHIR.put.relatedPersonRelationshipType);
	app.put('/:apikey/group-type/:_id?', DefaultFHIR.put.groupType);
	app.put('/:apikey/identifier-use/:_id?', DefaultFHIR.put.identifierUse);
	app.put('/:apikey/identifier-type/:_id?', DefaultFHIR.put.identifierType);
	app.put('/:apikey/name-use/:_id?', DefaultFHIR.put.nameUse);
	app.put('/:apikey/contact-point-system/:_id?', DefaultFHIR.put.contactPointSystem);
	app.put('/:apikey/contact-point-use/:_id?', DefaultFHIR.put.contactPointUse);
	app.put('/:apikey/address-use/:_id?', DefaultFHIR.put.addressUse);
	app.put('/:apikey/address-type/:_id?', DefaultFHIR.put.addressType);
	app.put('/:apikey/appointment-reason-code/:_id?', DefaultFHIR.put.appointmentReasonCode);
	app.put('/:apikey/slot-status/:_id?', DefaultFHIR.put.slotStatus);
	app.put('/:apikey/appointment-status/:_id?', DefaultFHIR.put.appointmentStatus);
	app.put('/:apikey/participant-required/:_id?', DefaultFHIR.put.participantRequired);
	app.put('/:apikey/participation-status/:_id?', DefaultFHIR.put.participationStatus);
	app.put('/:apikey/act-encounter-code/:_id?', DefaultFHIR.put.actEncounterCode);	
	app.put('/:apikey/act-priority/:_id?', DefaultFHIR.put.actPriority);	
	app.put('/:apikey/account-status/:_id?', DefaultFHIR.put.accountStatus);
	app.put('/:apikey/account-type/:_id?', DefaultFHIR.put.accountType);
	app.put('/:apikey/diagnosis-role/:_id?', DefaultFHIR.put.diagnosisRole);
	app.put('/:apikey/encounter-admit-source/:_id?', DefaultFHIR.put.encounterAdmitSource);
	app.put('/:apikey/encounter-diet/:_id?', DefaultFHIR.put.encounterDiet);
	app.put('/:apikey/encounter-discharge-disposition/:_id?', DefaultFHIR.put.encounterDischargeDisposition);
	app.put('/:apikey/encounter-location-status/:_id?', DefaultFHIR.put.encounterLocationStatus);
	app.put('/:apikey/encounter-participant-type/:_id?', DefaultFHIR.put.encounterParticipantType);	
	app.put('/:apikey/encounter-reason/:_id?', DefaultFHIR.put.encounterReason);
	app.put('/:apikey/encounter-special-courtesy/:_id?', DefaultFHIR.put.encounterSpecialCourtesy);
	app.put('/:apikey/encounter-special-arrangements/:_id?', DefaultFHIR.put.encounterSpecialArrangements);
	app.put('/:apikey/encounter-status/:_id?', DefaultFHIR.put.encounterStatus);
	app.put('/:apikey/encounter-type/:_id?', DefaultFHIR.put.encounterType);
	app.put('/:apikey/episode-of-care-type/:_id?', DefaultFHIR.put.episodeOfCareType);
	app.put('/:apikey/episode-of-care-status/:_id?', DefaultFHIR.put.episodeOfCareStatus);
	app.put('/:apikey/flag-status/:_id?', DefaultFHIR.put.flagStatus);	
	app.put('/:apikey/flag-category/:_id?', DefaultFHIR.put.flagCategory);	
	app.put('/:apikey/flag-code/:_id?', DefaultFHIR.put.flagCode);
	app.put('/:apikey/re-admission-indicator/:_id?', DefaultFHIR.put.reAdmissionIndicator);
	app.put('/:apikey/udi-entry-type/:_id?', DefaultFHIR.put.udiEntryType);
	app.put('/:apikey/device-status/:_id?', DefaultFHIR.put.deviceStatus);
	app.put('/:apikey/device-kind/:_id?', DefaultFHIR.put.deviceKind);
	app.put('/:apikey/device-safety/:_id?', DefaultFHIR.put.deviceSafety);
	app.put('/:apikey/operational-status/:_id?', DefaultFHIR.put.operationalStatus);
	app.put('/:apikey/parameter-group/:_id?', DefaultFHIR.put.parameterGroup);
	app.put('/:apikey/measurement-principle/:_id?', DefaultFHIR.put.measurementPrinciple);
	app.put('/:apikey/specification-type/:_id?', DefaultFHIR.put.specificationType);
	app.put('/:apikey/metric-operational-status/:_id?', DefaultFHIR.put.metricOperationalStatus);
	app.put('/:apikey/metric-color/:_id?', DefaultFHIR.put.metricColor);
	app.put('/:apikey/metric-category/:_id?', DefaultFHIR.put.metricCategory);
	app.put('/:apikey/metric-calibration-type/:_id?', DefaultFHIR.put.metricCalibrationType);
	app.put('/:apikey/metric-calibration-state/:_id?', DefaultFHIR.put.metricCalibrationState);
	app.put('/:apikey/substance-status/:_id?', DefaultFHIR.put.substanceStatus);
	app.put('/:apikey/substance-category/:_id?', DefaultFHIR.put.substanceCategory);
	app.put('/:apikey/substance-code/:_id?', DefaultFHIR.put.substanceCode);
	// Service Provider Directory Resources, by : hardika cs(start)
	app.put('/:apikey/organization-type/:_id?', DefaultFHIR.put.organizationType);
	app.put('/:apikey/contact-entity-type/:_id', DefaultFHIR.put.contactentityType);
	app.put('/:apikey/location-status/:_id', DefaultFHIR.put.locationStatus);
	app.put('/:apikey/bed-status/:_id', DefaultFHIR.put.bedStatus);
	app.put('/:apikey/location-mode/:_id', DefaultFHIR.put.locationMode);
	app.put('/:apikey/service-delivery-location-role-type/:_id', DefaultFHIR.put.serviceDeliveryLocationRoleType);
	app.put('/:apikey/location-physical-type/:_id', DefaultFHIR.put.locationPhysicalType);
	app.put('/:apikey/qualification-code/:_id', DefaultFHIR.put.qualificationCode);
	app.put('/:apikey/practitioner-role-code/:_id', DefaultFHIR.put.practitionerRoleCode);
	app.put('/:apikey/practice-code/:_id', DefaultFHIR.put.practiceCode);
	app.put('/:apikey/days-of-week/:_id', DefaultFHIR.put.daysOfWeek);
	app.put('/:apikey/service-category/:_id', DefaultFHIR.put.serviceCategory);
	app.put('/:apikey/service-type/:_id', DefaultFHIR.put.serviceType);
	app.put('/:apikey/service-provision-conditions/:_id', DefaultFHIR.put.serviceProvisionConditions);
	app.put('/:apikey/service-referral-method/:_id', DefaultFHIR.put.serviceReferralMethod);
	app.put('/:apikey/endpoint-status/:_id', DefaultFHIR.put.endpointStatus);
	app.put('/:apikey/endpoint-connection-type/:_id', DefaultFHIR.put.endpointConnectionType);
	app.put('/:apikey/endpoint-payload-type/:_id', DefaultFHIR.put.endpointPayloadType);
	// Service Provider Directory Resources, by : hardika cs(end)
	
}
module.exports = routesDefaultFHIR;