CREATE SCHEMA IF NOT EXISTS core;

CREATE SCHEMA IF NOT EXISTS ops_data;

CREATE SCHEMA IF NOT EXISTS payment_data;

CREATE SCHEMA IF NOT EXISTS platforms;

CREATE  TABLE core.organizations ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	name                 text  NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT organizations_pkey PRIMARY KEY ( id ),
	CONSTRAINT organizations_name_key UNIQUE ( name ) 
 );

CREATE  TABLE core.permissions ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	name                 text  NOT NULL  ,
	display_name         text  NOT NULL  ,
	description          text    ,
	resource_type        text  NOT NULL  ,
	"action"             text  NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT permissions_pkey PRIMARY KEY ( id ),
	CONSTRAINT permissions_name_key UNIQUE ( name ) 
 );

CREATE  TABLE core.roles ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	name                 text  NOT NULL  ,
	display_name         text  NOT NULL  ,
	description          text    ,
	"level"              integer  NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT roles_pkey PRIMARY KEY ( id ),
	CONSTRAINT roles_name_key UNIQUE ( name ) 
 );

CREATE  TABLE core.branches ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	organization_id      uuid  NOT NULL  ,
	name                 text  NOT NULL  ,
	city                 text  NOT NULL  ,
	country              text  NOT NULL  ,
	phone_number         text  NOT NULL  ,
	currency             text  NOT NULL  ,
	timezone             text  NOT NULL  ,
	is_active            boolean DEFAULT true NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT branches_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE core.grids ( 
	id                   uuid DEFAULT uuid_generate_v4() NOT NULL  ,
	organization_id      uuid  NOT NULL  ,
	branch_id            uuid  NOT NULL  ,
	ps_provider_id       uuid  NOT NULL  ,
	meter_provider_id    uuid  NOT NULL  ,
	momo_provider_id     uuid  NOT NULL  ,
	name                 text  NOT NULL  ,
	slug                 text  NOT NULL  ,
	image_url            text DEFAULT 'default-grid-image.jpg'::text NOT NULL  ,
	grid_code            integer  NOT NULL  ,
	location             geometry    ,
	notes                text    ,
	generation_capacity_kw decimal(8,2)    ,
	storage_capacity_kwh decimal(8,2)    ,
	wifi                 json[]    ,
	contacts             jsonb[]    ,
	documents            jsonb[]    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_table_3_id PRIMARY KEY ( id )
 );

CREATE INDEX idx_grids_slug ON core.grids  ( slug, grid_code );

CREATE  TABLE core.role_permissions ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	role_id              uuid  NOT NULL  ,
	permission_id        uuid  NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT role_permissions_pkey PRIMARY KEY ( id ),
	CONSTRAINT role_permissions_role_id_permission_id_key UNIQUE ( role_id, permission_id ) 
 );

CREATE INDEX idx_role_permissions_role_id ON core.role_permissions USING  btree ( role_id );

CREATE INDEX idx_role_permissions_permission_id ON core.role_permissions USING  btree ( permission_id );

CREATE  TABLE core.user_profiles ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	organization_id      uuid    ,
	branch_id            uuid    ,
	role_id              uuid    ,
	email                text  NOT NULL  ,
	full_name            text    ,
	phone_number         text    ,
	is_active            boolean DEFAULT true   ,
	access_scope         jsonb DEFAULT '{}'::jsonb   ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	deleted_by           uuid    ,
	deleted_at           timestamptz    ,
	CONSTRAINT user_profiles_pkey PRIMARY KEY ( id )
 );

CREATE INDEX idx_user_profiles_organization_id ON core.user_profiles  ( organization_id );

CREATE INDEX idx_user_profiles_branch_id ON core.user_profiles  ( branch_id );

CREATE  TABLE core.user_sessions ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	user_id              uuid  NOT NULL  ,
	organization_id      uuid  NOT NULL  ,
	role_id              uuid  NOT NULL  ,
	branch_id            uuid    ,
	session_token        text  NOT NULL  ,
	expires_at           timestamptz  NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT user_sessions_pkey PRIMARY KEY ( id )
 );

CREATE INDEX idx_user_sessions_user_id ON core.user_sessions USING  btree ( user_id );

CREATE INDEX idx_user_sessions_session_token ON core.user_sessions USING  btree ( session_token );

CREATE INDEX idx_user_sessions_expires_at ON core.user_sessions USING  btree ( expires_at );

CREATE  TABLE core.customers ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	organization_id      uuid  NOT NULL  ,
	branch_id            uuid  NOT NULL  ,
	grid_id              uuid  NOT NULL  ,
	customer_code        text  NOT NULL  ,
	full_name            text  NOT NULL  ,
	phone_number         text    ,
	email                text    ,
	location             geometry    ,
	customer_type        text  NOT NULL  ,
	connection_status    text DEFAULT 'active'::text NOT NULL  ,
	connection_date      date    ,
	meter_provider_id    uuid  NOT NULL  ,
	current_balance      decimal(15,4) DEFAULT 0   ,
	is_active            boolean DEFAULT true NOT NULL  ,
	notes                text    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	deleted_at           timestamptz    ,
	CONSTRAINT unq_customers_customer_code UNIQUE ( customer_code ) ,
	CONSTRAINT pk_table_5_id PRIMARY KEY ( id )
 );

CREATE  TABLE core.organization_members ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	organization_id      uuid  NOT NULL  ,
	user_id              uuid  NOT NULL  ,
	role_id              uuid  NOT NULL  ,
	branch_id            uuid    ,
	invited_by           uuid    ,
	status               text DEFAULT 'active'::text NOT NULL  ,
	joined_at            timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT organization_members_pkey PRIMARY KEY ( id ),
	CONSTRAINT organization_members_organization_id_user_id_key UNIQUE ( organization_id, user_id ) 
 );

CREATE INDEX idx_organization_members_user_id ON core.organization_members USING  btree ( user_id );

CREATE INDEX idx_organization_members_organization_id ON core.organization_members USING  btree ( organization_id );

CREATE INDEX idx_organization_members_role_id ON core.organization_members USING  btree ( role_id );

CREATE INDEX idx_organization_members_branch_id ON core.organization_members USING  btree ( branch_id );

CREATE  TABLE core.role_changes ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	organization_id      uuid  NOT NULL  ,
	user_id              uuid  NOT NULL  ,
	from_role_id         uuid    ,
	to_role_id           uuid  NOT NULL  ,
	changed_by           uuid  NOT NULL  ,
	reason               text    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT role_changes_pkey PRIMARY KEY ( id )
 );

CREATE INDEX idx_role_changes_organization_id ON core.role_changes USING  btree ( organization_id );

CREATE INDEX idx_role_changes_user_id ON core.role_changes USING  btree ( user_id );

CREATE INDEX idx_role_changes_changed_by ON core.role_changes USING  btree ( changed_by );

CREATE  TABLE ops_data.daily_ps_summary ( 
	id                   uuid  NOT NULL  ,
	power_system_id      uuid    ,
	"date"               date    ,
	avg_battery_soc      decimal(5,2)    ,
	min_battery_soc      decimal(5,2)    ,
	max_inverter_output  decimal(8,3)    ,
	total_solar_kwh      decimal(10,3)    ,
	total_load_kwh       decimal(10,3)    ,
	uptime_hours         decimal(4,2)    ,
	critical_events_count integer    ,
	warning_events_count integer    ,
	data_points_count    integer    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_daily_ps_summary PRIMARY KEY ( id )
 );

CREATE  TABLE ops_data.hourly_ps_summary ( 
	id                   uuid  NOT NULL  ,
	power_system_id      uuid    ,
	"hour"               timestamptz    ,
	avg_battery_soc      decimal(5,2)    ,
	avg_inverter_output  decimal(8,3)    ,
	solar_kwh            decimal(10,3)    ,
	load_kwh             decimal(10,3)    ,
	data_points          integer    ,
	events_count         integer    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_daily_ps_summary_0 PRIMARY KEY ( id )
 );

CREATE  TABLE ops_data.meter_events_normalized ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	organization_id      uuid  NOT NULL  ,
	branch_id            uuid  NOT NULL  ,
	grid_id              uuid  NOT NULL  ,
	customer_id          uuid  NOT NULL  ,
	meter_provider_id    uuid  NOT NULL  ,
	provider_meter_id    uuid  NOT NULL  ,
	provider_event_id    uuid  NOT NULL  ,
	event_timestamp      timestamptz  NOT NULL  ,
	event_category       text  NOT NULL  ,
	event_type           text  NOT NULL  ,
	severity             text  NOT NULL  ,
	description          text  NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_meter_logs_normalized_0 PRIMARY KEY ( id )
 );

CREATE  TABLE ops_data.meter_logs_normalized ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	organization_id      uuid  NOT NULL  ,
	branch_id            uuid  NOT NULL  ,
	grid_id              uuid  NOT NULL  ,
	customer_id          uuid  NOT NULL  ,
	meter_provider_id    uuid  NOT NULL  ,
	provider_meter_id    uuid  NOT NULL  ,
	provider_log_id      uuid  NOT NULL  ,
	log_timestamp        timestamptz  NOT NULL  ,
	reading_period       text  NOT NULL  ,
	data_quality         text  NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_meter_logs_normalized PRIMARY KEY ( id )
 );

CREATE  TABLE ops_data.onepower_meter_events ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	meter_id             uuid  NOT NULL  ,
	event_timestamp      timestamptz  NOT NULL  ,
	event_type           text  NOT NULL  ,
	event_code           integer    ,
	severity             text  NOT NULL  ,
	description          text  NOT NULL  ,
	event_data           jsonb  NOT NULL  ,
	raw_data             jsonb  NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_sm_meter_events_1 PRIMARY KEY ( id )
 );

CREATE  TABLE ops_data.onepower_meter_logs ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	meter_id             uuid  NOT NULL  ,
	log_timestamp        timestamptz  NOT NULL  ,
	sequence_number      bigint  NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_sm_meter_logs_1 PRIMARY KEY ( id ),
	CONSTRAINT unq_sm_meter_logs_1 UNIQUE ( meter_id, log_timestamp, sequence_number ) 
 );

CREATE  TABLE ops_data.ps_events ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	power_system_id      uuid    ,
	"timestamp"          timestamptz  NOT NULL  ,
	event_type           text    ,
	severity             text    ,
	description          text    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_ps_events PRIMARY KEY ( id )
 );

CREATE  TABLE ops_data.ps_logs ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	power_system_id      uuid    ,
	"timestamp"          timestamptz  NOT NULL  ,
	battery_soc_percent  decimal(5,2)    ,
	battery_voltage_v    decimal(6,2)    ,
	inverter_output_kw   decimal(8,3)    ,
	solar_generation_kw  decimal(8,3)    ,
	load_consumption_kw  decimal(8,3)    ,
	system_status        text    ,
	data_quality         decimal(3,2)    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_ps_logs PRIMARY KEY ( id )
 );

CREATE  TABLE ops_data.sm_meter_events ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	meter_id             uuid  NOT NULL  ,
	event_timestamp      timestamptz  NOT NULL  ,
	event_type           text  NOT NULL  ,
	event_code           integer    ,
	severity             text  NOT NULL  ,
	description          text  NOT NULL  ,
	event_data           jsonb  NOT NULL  ,
	raw_data             jsonb  NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_sm_meter_events PRIMARY KEY ( id )
 );

CREATE  TABLE ops_data.sm_meter_logs ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	meter_id             uuid  NOT NULL  ,
	log_timestamp        timestamptz  NOT NULL  ,
	sequence_number      bigint  NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_sm_meter_logs PRIMARY KEY ( id ),
	CONSTRAINT unq_sm_meter_logs UNIQUE ( meter_id, log_timestamp, sequence_number ) 
 );

CREATE  TABLE ops_data.sparkmeter_meter_events ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	meter_id             uuid  NOT NULL  ,
	event_timestamp      timestamptz  NOT NULL  ,
	event_type           text  NOT NULL  ,
	event_code           integer    ,
	severity             text  NOT NULL  ,
	description          text  NOT NULL  ,
	event_data           jsonb  NOT NULL  ,
	raw_data             jsonb  NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_sm_meter_events_0 PRIMARY KEY ( id )
 );

CREATE  TABLE ops_data.sparkmeter_meter_logs ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	meter_id             uuid  NOT NULL  ,
	log_timestamp        timestamptz  NOT NULL  ,
	sequence_number      bigint  NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_sm_meter_logs_0 PRIMARY KEY ( id ),
	CONSTRAINT unq_sm_meter_logs_0 UNIQUE ( meter_id, log_timestamp, sequence_number ) 
 );

CREATE  TABLE payment_data.transactions ( 
	id                   uuid DEFAULT uuid_generate_v4() NOT NULL  ,
	transaction_reference text  NOT NULL  ,
	external_transaction_id text    ,
	customer_id          uuid  NOT NULL  ,
	meter_id             uuid    ,
	grid_id              uuid    ,
	transaction_type     text  NOT NULL  ,
	amount               decimal(15,4)  NOT NULL  ,
	currency_code        text  NOT NULL  ,
	energy_purchased_kwh decimal(10,4)    ,
	tariff_rate          decimal(10,6)    ,
	payment_method       text    ,
	payment_provider     text    ,
	payment_reference    text    ,
	status               text  NOT NULL  ,
	processed_at         timestamptz    ,
	meter_provider       uuid    ,
	platform_transaction_id text    ,
	raw_transaction_data jsonb    ,
	balance_before       decimal(15,4)    ,
	balance_after        decimal(15,4)    ,
	description          text    ,
	notes                text    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_transactions PRIMARY KEY ( id ),
	CONSTRAINT unq_transactions UNIQUE ( transaction_reference ) 
 );

CREATE  TABLE payment_data.onepower_transactions ( 
	id                   uuid DEFAULT uuid_generate_v4() NOT NULL  ,
	transaction_id       uuid    ,
	onepower_transaction_id text  NOT NULL  ,
	meter_number         text  NOT NULL  ,
	credit_purchased     decimal(10,4)    ,
	tariff_plan_id       text    ,
	payment_channel      text    ,
	receipt_number       text    ,
	onepower_raw_data    jsonb    ,
	sync_status          text    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_sparkmeter_transactions_1 PRIMARY KEY ( id )
 );

CREATE  TABLE payment_data.sm_transactions ( 
	id                   uuid DEFAULT uuid_generate_v4() NOT NULL  ,
	transaction_id       uuid    ,
	sm_transaction_id    text  NOT NULL  ,
	meter_number         text  NOT NULL  ,
	credit_purchased     decimal(10,4)    ,
	payment_channel      text    ,
	sync_status          text    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_sparkmeter_transactions_0 PRIMARY KEY ( id )
 );

CREATE  TABLE payment_data.sparkmeter_transactions ( 
	id                   uuid DEFAULT uuid_generate_v4() NOT NULL  ,
	transaction_id       uuid    ,
	sparkmeter_transaction_id text  NOT NULL  ,
	meter_number         text  NOT NULL  ,
	credit_purchased     decimal(10,4)    ,
	tariff_plan_id       text    ,
	payment_channel      text    ,
	receipt_number       text    ,
	vendor_reference     text    ,
	sparkmeter_raw_data  jsonb    ,
	sync_status          text    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_sparkmeter_transactions PRIMARY KEY ( id )
 );

CREATE  TABLE payment_data.transaction_audit_log ( 
	id                   uuid DEFAULT uuid_generate_v4() NOT NULL  ,
	transaction_id       uuid    ,
	"action"             text  NOT NULL  ,
	old_values           jsonb    ,
	new_values           jsonb    ,
	changed_by           uuid    ,
	change_reason        text    ,
	ip_address           inet    ,
	user_agent           text    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	CONSTRAINT pk_transaction_audit_log PRIMARY KEY ( id )
 );

CREATE  TABLE payment_data.transaction_fees ( 
	id                   uuid DEFAULT uuid_generate_v4() NOT NULL  ,
	transaction_id       uuid    ,
	fee_type             text    ,
	fee_amount           decimal(10,4) DEFAULT 0 NOT NULL  ,
	fee_percentage       decimal(5,4)    ,
	charged_to           text  NOT NULL  ,
	description          text    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_transaction_fees PRIMARY KEY ( id )
 );

CREATE  TABLE platforms.meter_providers ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	name                 text  NOT NULL  ,
	slug                 text  NOT NULL  ,
	description          text    ,
	api_endpoint         text    ,
	auth_method          text    ,
	documentation_url    text    ,
	support_email        text    ,
	schema_version       text DEFAULT 1.0   ,
	is_active            boolean DEFAULT true NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP   ,
	CONSTRAINT pk_table_4_id PRIMARY KEY ( id ),
	CONSTRAINT unq_meter_providers UNIQUE ( slug ) 
 );

CREATE  TABLE platforms.momo_providers ( 
	id                   uuid DEFAULT uuid_generate_v4() NOT NULL  ,
	name                 text  NOT NULL  ,
	slug                 text  NOT NULL  ,
	region               text    ,
	country_codes        text[]    ,
	description          text    ,
	api_endpoint         text    ,
	auth_method          text    ,
	documentation_url    text    ,
	support_email        text    ,
	schema_version       text    ,
	is_active            boolean DEFAULT true NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_momo_providers PRIMARY KEY ( id ),
	CONSTRAINT unq_momo_providers UNIQUE ( slug ) 
 );

CREATE  TABLE platforms.onepower_grid_configs ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	grid_id              uuid  NOT NULL  ,
	is_active            boolean DEFAULT false NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_onepower_grid_configs PRIMARY KEY ( id )
 );

CREATE  TABLE platforms.onepower_meters ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	organization_id      uuid  NOT NULL  ,
	branch_id            uuid  NOT NULL  ,
	grid_id              uuid  NOT NULL  ,
	customer_id          uuid  NOT NULL  ,
	serial_number        text  NOT NULL  ,
	commissioning_date   date    ,
	location             geometry    ,
	status               text DEFAULT 'enabled'::text   ,
	last_reading_date    timestamptz    ,
	notes                text    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_sm_meters_1 PRIMARY KEY ( id ),
	CONSTRAINT unq_sm_meters_3 UNIQUE ( customer_id ) ,
	CONSTRAINT unq_sm_meters_4 UNIQUE ( serial_number ) 
 );

CREATE  TABLE platforms.ps_providers ( 
	id                   uuid DEFAULT uuid_generate_v4() NOT NULL  ,
	provider_name        varchar(100)  NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_ps_providers PRIMARY KEY ( id )
 );

CREATE  TABLE platforms.sm_grid_configs ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	grid_id              uuid  NOT NULL  ,
	is_active            boolean DEFAULT false NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	updated_at           timestamptz DEFAULT CURRENT_DATE NOT NULL  ,
	CONSTRAINT pk_smg_meters PRIMARY KEY ( id )
 );

CREATE  TABLE platforms.sm_meters ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	organization_id      uuid  NOT NULL  ,
	branch_id            uuid  NOT NULL  ,
	grid_id              uuid  NOT NULL  ,
	customer_id          uuid  NOT NULL  ,
	serial_number        text  NOT NULL  ,
	commissioning_date   date    ,
	location             geometry    ,
	sockets              uuid    ,
	status               text DEFAULT 'enabled'::text   ,
	last_reading_date    timestamptz    ,
	notes                text    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_sm_meters PRIMARY KEY ( id ),
	CONSTRAINT unq_sm_meters UNIQUE ( customer_id ) ,
	CONSTRAINT unq_sm_meters_0 UNIQUE ( serial_number ) 
 );

CREATE  TABLE platforms.sm_socket_templates ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	name                 text  NOT NULL  ,
	description          text    ,
	config               jsonb  NOT NULL  ,
	is_active            boolean DEFAULT true NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_sm_socket_templates PRIMARY KEY ( id )
 );

CREATE  TABLE platforms.sm_sockets ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	meter_id             uuid  NOT NULL  ,
	socket_number        integer  NOT NULL  ,
	socket_template_id   uuid    ,
	socket_config        jsonb  NOT NULL  ,
	status               text DEFAULT 'disabled'::text NOT NULL  ,
	last_reading_date    timestamptz    ,
	notes                text    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_sm_sockets PRIMARY KEY ( id )
 );

CREATE  TABLE platforms.sparkmeter_grid_configs ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	grid_id              uuid  NOT NULL  ,
	is_active            boolean DEFAULT false NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_sparkmeter_grid_configs PRIMARY KEY ( id )
 );

CREATE  TABLE platforms.sparkmeter_meters ( 
	id                   uuid DEFAULT gen_random_uuid() NOT NULL  ,
	organization_id      uuid  NOT NULL  ,
	branch_id            uuid  NOT NULL  ,
	grid_id              uuid  NOT NULL  ,
	customer_id          uuid  NOT NULL  ,
	serial_number        text  NOT NULL  ,
	commissioning_date   date    ,
	location             geometry    ,
	status               text DEFAULT 'enabled'::text   ,
	last_reading_date    timestamptz    ,
	notes                text    ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_sm_meters_0 PRIMARY KEY ( id ),
	CONSTRAINT unq_sm_meters_1 UNIQUE ( customer_id ) ,
	CONSTRAINT unq_sm_meters_2 UNIQUE ( serial_number ) 
 );

CREATE  TABLE platforms.momo_grid_configs ( 
	id                   uuid DEFAULT uuid_generate_v4() NOT NULL  ,
	grid_id              uuid  NOT NULL  ,
	provider_id          uuid  NOT NULL  ,
	operator_phone_number text  NOT NULL  ,
	operator_account_name text    ,
	operator_account_reference text    ,
	merchant_identifier  text    ,
	api_key              text  NOT NULL  ,
	api_secret           text  NOT NULL  ,
	secondary_id         text    ,
	pin_or_code          text    ,
	callback_url         text  NOT NULL  ,
	timeout_url          text    ,
	environment          text DEFAULT 'sandbox'::text NOT NULL  ,
	provider_config      jsonb  NOT NULL  ,
	is_active            boolean DEFAULT true NOT NULL  ,
	created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	updated_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT pk_momo_grid_configs PRIMARY KEY ( id )
 );

ALTER TABLE core.branches ADD CONSTRAINT fk_branches_organization_id_organizations_id FOREIGN KEY ( organization_id ) REFERENCES core.organizations( id ) ON DELETE CASCADE;

ALTER TABLE core.customers ADD CONSTRAINT fk_customers_grid_id_grids_id FOREIGN KEY ( grid_id ) REFERENCES core.grids( id );

ALTER TABLE core.customers ADD CONSTRAINT fk_customers_meter_providers FOREIGN KEY ( meter_provider_id ) REFERENCES platforms.meter_providers( id );

ALTER TABLE core.grids ADD CONSTRAINT fk_grids_branches FOREIGN KEY ( branch_id ) REFERENCES core.branches( id );

ALTER TABLE core.grids ADD CONSTRAINT fk_grids_organizations FOREIGN KEY ( organization_id ) REFERENCES core.organizations( id );

ALTER TABLE core.grids ADD CONSTRAINT fk_grids_momo_providers_0 FOREIGN KEY ( momo_provider_id ) REFERENCES platforms.momo_providers( id );

ALTER TABLE core.grids ADD CONSTRAINT fk_grids_ps_providers_0 FOREIGN KEY ( ps_provider_id ) REFERENCES platforms.ps_providers( id );

ALTER TABLE core.grids ADD CONSTRAINT fk_grids_meter_providers FOREIGN KEY ( meter_provider_id ) REFERENCES platforms.meter_providers( id );

ALTER TABLE core.organization_members ADD CONSTRAINT fk_organization_members_organizations FOREIGN KEY ( organization_id ) REFERENCES core.organizations( id );

ALTER TABLE core.organization_members ADD CONSTRAINT fk_organization_members_user_profiles FOREIGN KEY ( user_id ) REFERENCES core.user_profiles( id );

ALTER TABLE core.organization_members ADD CONSTRAINT fk_organization_members_roles FOREIGN KEY ( role_id ) REFERENCES core.roles( id );

ALTER TABLE core.organization_members ADD CONSTRAINT fk_organization_members_branches FOREIGN KEY ( branch_id ) REFERENCES core.branches( id );

ALTER TABLE core.organization_members ADD CONSTRAINT fk_organization_members_user_profiles_0 FOREIGN KEY ( invited_by ) REFERENCES core.user_profiles( id );

ALTER TABLE core.role_changes ADD CONSTRAINT fk_role_changes_organizations FOREIGN KEY ( organization_id ) REFERENCES core.organizations( id );

ALTER TABLE core.role_changes ADD CONSTRAINT fk_role_changes_user_profiles FOREIGN KEY ( user_id ) REFERENCES core.user_profiles( id );

ALTER TABLE core.role_changes ADD CONSTRAINT fk_role_changes_roles FOREIGN KEY ( from_role_id ) REFERENCES core.roles( id );

ALTER TABLE core.role_changes ADD CONSTRAINT fk_role_changes_roles_0 FOREIGN KEY ( to_role_id ) REFERENCES core.roles( id );

ALTER TABLE core.role_changes ADD CONSTRAINT fk_role_changes_user_profiles_0 FOREIGN KEY ( changed_by ) REFERENCES core.user_profiles( id );

ALTER TABLE core.role_permissions ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY ( permission_id ) REFERENCES core.permissions( id ) ON DELETE CASCADE;

ALTER TABLE core.role_permissions ADD CONSTRAINT fk_role_permissions_roles FOREIGN KEY ( role_id ) REFERENCES core.roles( id );

ALTER TABLE core.user_profiles ADD CONSTRAINT fk_user_profiles_branch_id_branches_id FOREIGN KEY ( branch_id ) REFERENCES core.branches( id ) ON DELETE SET NULL;

ALTER TABLE core.user_profiles ADD CONSTRAINT fk_user_profiles_organization_id_organizations_id_0 FOREIGN KEY ( organization_id ) REFERENCES core.organizations( id ) ON DELETE SET NULL;

ALTER TABLE core.user_profiles ADD CONSTRAINT fk_user_profiles_roles FOREIGN KEY ( role_id ) REFERENCES core.roles( id );

ALTER TABLE core.user_sessions ADD CONSTRAINT fk_user_sessions_user_profiles FOREIGN KEY ( user_id ) REFERENCES core.user_profiles( id );

ALTER TABLE core.user_sessions ADD CONSTRAINT fk_user_sessions_organizations FOREIGN KEY ( organization_id ) REFERENCES core.organizations( id );

ALTER TABLE core.user_sessions ADD CONSTRAINT fk_user_sessions_roles FOREIGN KEY ( role_id ) REFERENCES core.roles( id );

ALTER TABLE core.user_sessions ADD CONSTRAINT fk_user_sessions_branches FOREIGN KEY ( branch_id ) REFERENCES core.branches( id );

ALTER TABLE ops_data.daily_ps_summary ADD CONSTRAINT fk_daily_ps_summary_grids FOREIGN KEY ( power_system_id ) REFERENCES core.grids( id );

ALTER TABLE ops_data.hourly_ps_summary ADD CONSTRAINT fk_hourly_ps_summary_grids FOREIGN KEY ( power_system_id ) REFERENCES core.grids( id );

ALTER TABLE ops_data.meter_events_normalized ADD CONSTRAINT fk_meter_logs_normalized_grids_0 FOREIGN KEY ( grid_id ) REFERENCES core.grids( id );

ALTER TABLE ops_data.meter_events_normalized ADD CONSTRAINT fk_meter_logs_normalized_customers_0 FOREIGN KEY ( customer_id ) REFERENCES core.customers( id );

ALTER TABLE ops_data.meter_events_normalized ADD CONSTRAINT fk_meter_events_normalized_meter_providers FOREIGN KEY ( meter_provider_id ) REFERENCES platforms.meter_providers( id );

ALTER TABLE ops_data.meter_events_normalized ADD CONSTRAINT fk_meter_events_normalized_branches FOREIGN KEY ( branch_id ) REFERENCES core.branches( id );

ALTER TABLE ops_data.meter_events_normalized ADD CONSTRAINT fk_meter_events_normalized_organizations FOREIGN KEY ( organization_id ) REFERENCES core.organizations( id );

ALTER TABLE ops_data.meter_logs_normalized ADD CONSTRAINT fk_meter_logs_normalized_grids FOREIGN KEY ( grid_id ) REFERENCES core.grids( id );

ALTER TABLE ops_data.meter_logs_normalized ADD CONSTRAINT fk_meter_logs_normalized_customers FOREIGN KEY ( customer_id ) REFERENCES core.customers( id );

ALTER TABLE ops_data.meter_logs_normalized ADD CONSTRAINT fk_meter_logs_normalized_meter_providers FOREIGN KEY ( meter_provider_id ) REFERENCES platforms.meter_providers( id );

ALTER TABLE ops_data.meter_logs_normalized ADD CONSTRAINT fk_meter_logs_normalized_branches FOREIGN KEY ( branch_id ) REFERENCES core.branches( id );

ALTER TABLE ops_data.meter_logs_normalized ADD CONSTRAINT fk_meter_logs_normalized_organizations FOREIGN KEY ( organization_id ) REFERENCES core.organizations( id );

ALTER TABLE ops_data.onepower_meter_events ADD CONSTRAINT fk_onepower_meter_events_onepower_meters FOREIGN KEY ( meter_id ) REFERENCES platforms.onepower_meters( id );

ALTER TABLE ops_data.onepower_meter_logs ADD CONSTRAINT fk_onepower_meter_logs_onepower_meters FOREIGN KEY ( meter_id ) REFERENCES platforms.onepower_meters( id );

ALTER TABLE ops_data.ps_events ADD CONSTRAINT fk_ps_events_grids FOREIGN KEY ( power_system_id ) REFERENCES core.grids( id );

ALTER TABLE ops_data.ps_logs ADD CONSTRAINT fk_ps_logs_grids FOREIGN KEY ( power_system_id ) REFERENCES core.grids( id );

ALTER TABLE ops_data.sm_meter_events ADD CONSTRAINT fk_sm_meter_events_sm_meters FOREIGN KEY ( meter_id ) REFERENCES platforms.sm_meters( id );

ALTER TABLE ops_data.sm_meter_logs ADD CONSTRAINT fk_sm_meter_logs_sm_meters FOREIGN KEY ( meter_id ) REFERENCES platforms.sm_meters( id );

ALTER TABLE ops_data.sparkmeter_meter_events ADD CONSTRAINT fk_sparkmeter_meter_events_sparkmeter_meters FOREIGN KEY ( id ) REFERENCES platforms.sparkmeter_meters( id );

ALTER TABLE ops_data.sparkmeter_meter_logs ADD CONSTRAINT fk_sparkmeter_meter_logs_sparkmeter_meters FOREIGN KEY ( meter_id ) REFERENCES platforms.sparkmeter_meters( id );

ALTER TABLE payment_data.onepower_transactions ADD CONSTRAINT fk_sparkmeter_transactions_transactions_1 FOREIGN KEY ( transaction_id ) REFERENCES payment_data.transactions( id );

ALTER TABLE payment_data.sm_transactions ADD CONSTRAINT fk_sparkmeter_transactions_transactions_0 FOREIGN KEY ( transaction_id ) REFERENCES payment_data.transactions( id );

ALTER TABLE payment_data.sparkmeter_transactions ADD CONSTRAINT fk_sparkmeter_transactions_transactions FOREIGN KEY ( transaction_id ) REFERENCES payment_data.transactions( id );

ALTER TABLE payment_data.transaction_audit_log ADD CONSTRAINT fk_transaction_audit_log_transactions FOREIGN KEY ( transaction_id ) REFERENCES payment_data.transactions( id );

ALTER TABLE payment_data.transaction_fees ADD CONSTRAINT fk_transaction_fees_transactions FOREIGN KEY ( id ) REFERENCES payment_data.transactions( id );

ALTER TABLE payment_data.transactions ADD CONSTRAINT fk_transactions_customers FOREIGN KEY ( customer_id ) REFERENCES core.customers( id );

ALTER TABLE payment_data.transactions ADD CONSTRAINT fk_transactions_grids FOREIGN KEY ( grid_id ) REFERENCES core.grids( id );

ALTER TABLE payment_data.transactions ADD CONSTRAINT fk_transactions_meter_providers FOREIGN KEY ( meter_provider ) REFERENCES platforms.meter_providers( id );

ALTER TABLE platforms.momo_grid_configs ADD CONSTRAINT fk_momo_grid_configs_grids FOREIGN KEY ( grid_id ) REFERENCES core.grids( id );

ALTER TABLE platforms.momo_grid_configs ADD CONSTRAINT fk_momo_grid_configs_momo_providers_0 FOREIGN KEY ( provider_id ) REFERENCES platforms.momo_providers( id );

ALTER TABLE platforms.onepower_grid_configs ADD CONSTRAINT fk_onepower_grid_configs_grids FOREIGN KEY ( grid_id ) REFERENCES core.grids( id );

ALTER TABLE platforms.onepower_meters ADD CONSTRAINT fk_onepower_meters_grids FOREIGN KEY ( grid_id ) REFERENCES core.grids( id );

ALTER TABLE platforms.onepower_meters ADD CONSTRAINT fk_onepower_meters_customers FOREIGN KEY ( customer_id ) REFERENCES core.customers( id );

ALTER TABLE platforms.sm_grid_configs ADD CONSTRAINT fk_sm_grid_configs_grids FOREIGN KEY ( grid_id ) REFERENCES core.grids( id );

ALTER TABLE platforms.sm_meters ADD CONSTRAINT fk_sm_meters_grids FOREIGN KEY ( grid_id ) REFERENCES core.grids( id );

ALTER TABLE platforms.sm_meters ADD CONSTRAINT fk_sm_meters_customers FOREIGN KEY ( customer_id ) REFERENCES core.customers( id );

ALTER TABLE platforms.sm_sockets ADD CONSTRAINT fk_sm_sockets_sm_meters_0 FOREIGN KEY ( meter_id ) REFERENCES platforms.sm_meters( id );

ALTER TABLE platforms.sm_sockets ADD CONSTRAINT fk_sm_sockets_sm_socket_templates_0 FOREIGN KEY ( socket_template_id ) REFERENCES platforms.sm_socket_templates( id );

ALTER TABLE platforms.sparkmeter_grid_configs ADD CONSTRAINT fk_sparkmeter_grid_configs_grids FOREIGN KEY ( grid_id ) REFERENCES core.grids( id );

ALTER TABLE platforms.sparkmeter_meters ADD CONSTRAINT fk_sparkmeter_meters_grids FOREIGN KEY ( grid_id ) REFERENCES core.grids( id );

ALTER TABLE platforms.sparkmeter_meters ADD CONSTRAINT fk_sparkmeter_meters_customers FOREIGN KEY ( customer_id ) REFERENCES core.customers( id );

CREATE OR REPLACE FUNCTION core.can_manage_user(manager_id uuid, target_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
    SELECT EXISTS (
        SELECT 1 
        FROM "core"."user_profiles" manager
        JOIN "core"."user_profiles" target ON manager.organization_id = target.organization_id
        JOIN "core"."roles" r ON manager.role_id = r.id
        WHERE manager.id = manager_id 
        AND target.id = target_user_id
        AND r.name = 'executive'
        AND manager.id != target.id -- Can't manage themselves
    );
$function$
;

CREATE OR REPLACE FUNCTION core.get_organization_members(p_organization_id uuid)
 RETURNS TABLE(user_id uuid, email text, full_name text, role_name text, role_display_name text, role_level integer, status text, joined_at timestamp with time zone, branch_id uuid)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        om.user_id,
        au.email,
        COALESCE(au.raw_user_meta_data->>'full_name', '') as full_name,
        r.name as role_name,
        r.display_name as role_display_name,
        r.level as role_level,
        om.status,
        om.joined_at,
        om.branch_id
    FROM "core"."organization_members" om
    JOIN "auth"."users" au ON om.user_id = au.id
    JOIN "core"."user_profiles" up ON om.user_id = up.id
    JOIN "core"."roles" r ON om.role_id = r.id
    WHERE om.organization_id = p_organization_id
      AND up.deleted_at IS NULL
    ORDER BY r.level ASC, au.email ASC;
END;
$function$
;

CREATE OR REPLACE FUNCTION core.get_user_organization(user_id uuid)
 RETURNS uuid
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
    SELECT organization_id 
    FROM "core"."user_profiles" 
    WHERE id = user_id;
$function$
;

CREATE OR REPLACE FUNCTION core.get_user_organization_id(p_user_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN (
        SELECT organization_id 
        FROM "core"."user_profiles" 
        WHERE id = p_user_id AND deleted_at IS NULL
    );
END;
$function$
;

CREATE OR REPLACE FUNCTION core.get_user_role_level(p_user_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN (
        SELECT r.level
        FROM "core"."organization_members" om
        JOIN "core"."roles" r ON om.role_id = r.id
        WHERE om.user_id = p_user_id AND om.status = 'active'
        LIMIT 1
    );
END;
$function$
;

CREATE OR REPLACE FUNCTION core.is_executive(user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
    SELECT EXISTS (
        SELECT 1 
        FROM "core"."user_profiles" up
        JOIN "core"."roles" r ON up.role_id = r.id
        WHERE up.id = user_id 
        AND r.name = 'executive'
    );
$function$
;

CREATE OR REPLACE FUNCTION core.is_last_executive(p_organization_id uuid, p_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    executive_count int4;
BEGIN
    -- Count active executives in the organization (excluding the user in question)
    SELECT COUNT(*)
    INTO executive_count
    FROM "core"."organization_members" om
    JOIN "core"."roles" r ON om.role_id = r.id
    WHERE om.organization_id = p_organization_id
      AND om.user_id != p_user_id
      AND r.name = 'executive'
      AND om.status = 'active';
    
    RETURN executive_count = 0;
END;
$function$
;

CREATE OR REPLACE FUNCTION core.is_user_executive(p_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN (
        SELECT EXISTS(
            SELECT 1
            FROM "core"."organization_members" om
            JOIN "core"."roles" r ON om.role_id = r.id
            WHERE om.user_id = p_user_id 
            AND om.status = 'active'
            AND r.name = 'executive'
        )
    );
END;
$function$
;

CREATE OR REPLACE FUNCTION core.sync_user_email()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'core', 'public'
AS $function$
BEGIN
  -- Check if email or display name changed
  IF OLD.email IS DISTINCT FROM NEW.email OR 
     OLD.raw_user_meta_data->>'full_name' IS DISTINCT FROM NEW.raw_user_meta_data->>'full_name' THEN
    
    -- Log the changes for debugging
    RAISE LOG 'Syncing user data for user %: email % -> %, name % -> %', 
      NEW.id, 
      OLD.email, NEW.email,
      OLD.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'full_name';
    
    -- Update the user profile with new email and display name
    UPDATE core.user_profiles 
    SET 
      email = NEW.email,
      full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      updated_at = NOW()
    WHERE id = NEW.id;
    
    -- Check if the update affected any rows
    IF NOT FOUND THEN
      RAISE WARNING 'No user profile found for user % when syncing data', NEW.id;
    END IF;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth update
    RAISE WARNING 'Failed to sync user data for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$function$
;

COMMENT ON TABLE core.organizations IS 'Organization level details';

COMMENT ON COLUMN core.organizations.id IS 'Auto-generated';

COMMENT ON COLUMN core.organizations.name IS 'Organization name';

COMMENT ON COLUMN core.organizations.created_at IS 'Auto timestamp';

COMMENT ON COLUMN core.organizations.updated_at IS 'Auto timestamp';

COMMENT ON TABLE core.permissions IS 'Granular permissions that can be assigned to roles';

COMMENT ON COLUMN core.permissions.resource_type IS 'Type of resource: dashboard, users, branches, customers, reports, etc.';

COMMENT ON COLUMN core.permissions."action" IS 'Action allowed: view, create, update, delete, administer';

COMMENT ON COLUMN core.branches.id IS 'Auto-generated';

COMMENT ON COLUMN core.branches.organization_id IS 'References organizations.id';

COMMENT ON COLUMN core.branches.name IS 'Branch name';

COMMENT ON COLUMN core.branches.city IS 'City name';

COMMENT ON COLUMN core.branches.country IS 'ISO 3166-1 alpha-2 country code';

COMMENT ON COLUMN core.branches.phone_number IS 'Branch phone number';

COMMENT ON COLUMN core.branches.currency IS 'Local currency code';

COMMENT ON COLUMN core.branches.timezone IS 'IANA timezone';

COMMENT ON COLUMN core.branches.is_active IS 'Branch status';

COMMENT ON COLUMN core.branches.created_at IS 'Auto timestamp';

COMMENT ON COLUMN core.branches.updated_at IS 'Auto timestamp';

COMMENT ON TABLE core.grids IS 'Grid specific data.';

COMMENT ON COLUMN core.grids.id IS 'Auto-generated';

COMMENT ON COLUMN core.grids.organization_id IS 'References organizations.id';

COMMENT ON COLUMN core.grids.branch_id IS 'References branches.id';

COMMENT ON COLUMN core.grids.ps_provider_id IS 'References ps_providers table';

COMMENT ON COLUMN core.grids.meter_provider_id IS 'References meter providers table';

COMMENT ON COLUMN core.grids.momo_provider_id IS 'References momo provider id';

COMMENT ON COLUMN core.grids.name IS 'Grid name';

COMMENT ON COLUMN core.grids.slug IS 'URL-friendly identifier';

COMMENT ON COLUMN core.grids.image_url IS 'Image for grid page';

COMMENT ON COLUMN core.grids.grid_code IS 'Unique grid identifier';

COMMENT ON COLUMN core.grids.location IS 'Unified geo field';

COMMENT ON COLUMN core.grids.notes IS 'Additional notes about this grid';

COMMENT ON COLUMN core.grids.generation_capacity_kw IS 'Power system generation capacity';

COMMENT ON COLUMN core.grids.storage_capacity_kwh IS 'Power system storage capacity';

COMMENT ON COLUMN core.grids.wifi IS 'WiFi connection details';

COMMENT ON COLUMN core.grids.contacts IS 'List of site contacts';

COMMENT ON COLUMN core.grids.documents IS 'List of grid documentation';

COMMENT ON COLUMN core.grids.created_at IS 'Auto timestamp';

COMMENT ON COLUMN core.grids.updated_at IS 'Auto timestamp';

COMMENT ON TABLE core.role_permissions IS 'Many-to-many mapping between roles and permissions';

COMMENT ON COLUMN core.user_profiles.id IS 'Auto-generated';

COMMENT ON COLUMN core.user_profiles.organization_id IS 'References organizations.id';

COMMENT ON COLUMN core.user_profiles.branch_id IS 'References branches.id';

COMMENT ON COLUMN core.user_profiles.email IS 'User email';

COMMENT ON COLUMN core.user_profiles.full_name IS 'User''s full name';

COMMENT ON COLUMN core.user_profiles.phone_number IS 'User''s phone number';

COMMENT ON COLUMN core.user_profiles.is_active IS 'Account status';

COMMENT ON COLUMN core.user_profiles.access_scope IS 'JSON or enum for permissions';

COMMENT ON COLUMN core.user_profiles.created_at IS 'Auto timestamp';

COMMENT ON COLUMN core.user_profiles.updated_at IS 'Auto timestamp';

COMMENT ON COLUMN core.user_profiles.deleted_at IS 'Soft delete timestamp';

COMMENT ON TABLE core.user_sessions IS 'Tracks user sessions with organization and role context for logging and management';

COMMENT ON COLUMN core.user_sessions.branch_id IS 'Current branch context (NULL for executive role)';

COMMENT ON COLUMN core.customers.id IS 'Auto-generated';

COMMENT ON COLUMN core.customers.organization_id IS 'References organizations.id';

COMMENT ON COLUMN core.customers.branch_id IS 'References branches.id';

COMMENT ON COLUMN core.customers.grid_id IS 'References grids.id';

COMMENT ON COLUMN core.customers.customer_code IS 'Unique customer identifier';

COMMENT ON COLUMN core.customers.full_name IS 'Customer''s full name';

COMMENT ON COLUMN core.customers.phone_number IS 'Customer''s phone number';

COMMENT ON COLUMN core.customers.email IS 'Customer''s email';

COMMENT ON COLUMN core.customers.location IS 'Unified geo field';

COMMENT ON COLUMN core.customers.customer_type IS 'Type of customer';

COMMENT ON COLUMN core.customers.connection_status IS 'Connection status';

COMMENT ON COLUMN core.customers.connection_date IS 'Date of connection';

COMMENT ON COLUMN core.customers.meter_provider_id IS 'References meters table';

COMMENT ON COLUMN core.customers.current_balance IS 'Current balance';

COMMENT ON COLUMN core.customers.is_active IS 'Account status';

COMMENT ON COLUMN core.customers.notes IS 'Additional customer notes';

COMMENT ON COLUMN core.customers.created_at IS 'Auto timestamp';

COMMENT ON COLUMN core.customers.updated_at IS 'Auto timestamp';

COMMENT ON COLUMN core.customers.deleted_at IS 'Soft delete timestamp';

COMMENT ON TABLE core.organization_members IS 'Links users to organizations with specific roles and branch assignments';

COMMENT ON COLUMN core.organization_members.branch_id IS 'Assigned branch (NULL for executive role)';

COMMENT ON COLUMN core.organization_members.status IS 'Membership status: active, pending, suspended';

COMMENT ON TABLE core.role_changes IS 'Audit trail for all role changes within organizations, including executive transitions';

COMMENT ON COLUMN core.role_changes.changed_by IS 'User who initiated the role change';

COMMENT ON COLUMN core.role_changes.reason IS 'Optional reason for role change';

COMMENT ON TABLE ops_data.daily_ps_summary IS 'Daily summary of power system data';

COMMENT ON COLUMN ops_data.daily_ps_summary.id IS 'Auto-generated';

COMMENT ON COLUMN ops_data.daily_ps_summary.power_system_id IS 'References power_systems.id';

COMMENT ON COLUMN ops_data.daily_ps_summary."date" IS 'Summary date';

COMMENT ON COLUMN ops_data.daily_ps_summary.avg_battery_soc IS 'Average SOC for day';

COMMENT ON COLUMN ops_data.daily_ps_summary.min_battery_soc IS 'Minimum SOC reached';

COMMENT ON COLUMN ops_data.daily_ps_summary.max_inverter_output IS 'Peak generation';

COMMENT ON COLUMN ops_data.daily_ps_summary.total_solar_kwh IS 'Total solar energy';

COMMENT ON COLUMN ops_data.daily_ps_summary.total_load_kwh IS 'Total consumption';

COMMENT ON COLUMN ops_data.daily_ps_summary.uptime_hours IS 'System operational time';

COMMENT ON COLUMN ops_data.daily_ps_summary.critical_events_count IS 'Number of critical events';

COMMENT ON COLUMN ops_data.daily_ps_summary.warning_events_count IS 'Number of warnings';

COMMENT ON COLUMN ops_data.daily_ps_summary.data_points_count IS 'Number of readings received';

COMMENT ON TABLE ops_data.hourly_ps_summary IS 'Hourly summary of power system data';

COMMENT ON COLUMN ops_data.hourly_ps_summary.id IS 'Auto-generated';

COMMENT ON COLUMN ops_data.hourly_ps_summary.power_system_id IS 'References power_systems.id';

COMMENT ON COLUMN ops_data.hourly_ps_summary."hour" IS 'Summary hour';

COMMENT ON COLUMN ops_data.hourly_ps_summary.avg_battery_soc IS 'Average SOC for day';

COMMENT ON COLUMN ops_data.hourly_ps_summary.avg_inverter_output IS 'Average generation';

COMMENT ON COLUMN ops_data.hourly_ps_summary.solar_kwh IS 'Solar energy for hour';

COMMENT ON COLUMN ops_data.hourly_ps_summary.load_kwh IS 'Load energy for hour';

COMMENT ON COLUMN ops_data.hourly_ps_summary.data_points IS 'Readings in hour';

COMMENT ON COLUMN ops_data.hourly_ps_summary.events_count IS 'Number of events in hour';

COMMENT ON TABLE ops_data.meter_events_normalized IS 'Normalized meter events';

COMMENT ON COLUMN ops_data.meter_events_normalized.id IS 'Auto-generated';

COMMENT ON COLUMN ops_data.meter_events_normalized.organization_id IS 'References organizations.id';

COMMENT ON COLUMN ops_data.meter_events_normalized.branch_id IS 'References branches.id';

COMMENT ON COLUMN ops_data.meter_events_normalized.grid_id IS 'References grids.id';

COMMENT ON COLUMN ops_data.meter_events_normalized.customer_id IS 'References customers.id';

COMMENT ON COLUMN ops_data.meter_events_normalized.meter_provider_id IS 'References meter_providers.id';

COMMENT ON COLUMN ops_data.meter_events_normalized.provider_meter_id IS 'References provider-specific meter table';

COMMENT ON COLUMN ops_data.meter_events_normalized.provider_event_id IS 'References provider-specific event table';

COMMENT ON COLUMN ops_data.meter_events_normalized.event_timestamp IS 'When the event occurred';

COMMENT ON COLUMN ops_data.meter_events_normalized.event_category IS 'OPERATIONAL, FINANCIAL, TECHNICAL, SECURITY, etc.';

COMMENT ON COLUMN ops_data.meter_events_normalized.event_type IS 'Normalized event type';

COMMENT ON COLUMN ops_data.meter_events_normalized.severity IS 'INFO, WARNING, CRITICAL';

COMMENT ON COLUMN ops_data.meter_events_normalized.description IS 'Human-readable event description';

COMMENT ON COLUMN ops_data.meter_events_normalized.created_at IS 'Record creation time';

COMMENT ON TABLE ops_data.meter_logs_normalized IS 'Normalized meter logs';

COMMENT ON COLUMN ops_data.meter_logs_normalized.id IS 'Auto-generated';

COMMENT ON COLUMN ops_data.meter_logs_normalized.organization_id IS 'References organizations.id';

COMMENT ON COLUMN ops_data.meter_logs_normalized.branch_id IS 'References branches.id';

COMMENT ON COLUMN ops_data.meter_logs_normalized.grid_id IS 'References grids.id';

COMMENT ON COLUMN ops_data.meter_logs_normalized.customer_id IS 'References customers.id';

COMMENT ON COLUMN ops_data.meter_logs_normalized.meter_provider_id IS 'References meter_providers.id';

COMMENT ON COLUMN ops_data.meter_logs_normalized.provider_meter_id IS 'References provider-specific meter table';

COMMENT ON COLUMN ops_data.meter_logs_normalized.provider_log_id IS 'References provider-specific log table';

COMMENT ON COLUMN ops_data.meter_logs_normalized.log_timestamp IS 'When the reading was taken';

COMMENT ON COLUMN ops_data.meter_logs_normalized.reading_period IS 'INSTANTANEOUS, 15MINUTE, HOURLY, DAILY, MONTHLY';

COMMENT ON COLUMN ops_data.meter_logs_normalized.data_quality IS 'GOOD, ESTIMATED, MISSING';

COMMENT ON COLUMN ops_data.meter_logs_normalized.created_at IS 'Record creation time';

COMMENT ON TABLE ops_data.onepower_meter_events IS 'Meter event log';

COMMENT ON COLUMN ops_data.onepower_meter_events.id IS 'Auto-generated';

COMMENT ON COLUMN ops_data.onepower_meter_events.meter_id IS 'References sm_meters.id';

COMMENT ON COLUMN ops_data.onepower_meter_events.event_timestamp IS 'When the event occurred';

COMMENT ON COLUMN ops_data.onepower_meter_events.event_type IS 'ALARM, TAMPER, DISCONNECT, RECONNECT, etc.';

COMMENT ON COLUMN ops_data.onepower_meter_events.event_code IS 'Provider specific event code';

COMMENT ON COLUMN ops_data.onepower_meter_events.severity IS 'INFO, WARNING, CRITICAL';

COMMENT ON COLUMN ops_data.onepower_meter_events.description IS 'Human-readable event description';

COMMENT ON COLUMN ops_data.onepower_meter_events.event_data IS 'Additional event-specific data';

COMMENT ON COLUMN ops_data.onepower_meter_events.raw_data IS 'Complete raw event from provider platform';

COMMENT ON COLUMN ops_data.onepower_meter_events.created_at IS 'Record creation time';

COMMENT ON CONSTRAINT unq_sm_meter_logs_1 ON ops_data.onepower_meter_logs IS 'Prevent duplicate readings';

COMMENT ON TABLE ops_data.onepower_meter_logs IS 'Meter log / readings time series data';

COMMENT ON COLUMN ops_data.onepower_meter_logs.id IS 'Auto-generated';

COMMENT ON COLUMN ops_data.onepower_meter_logs.meter_id IS 'References sm_meters.id';

COMMENT ON COLUMN ops_data.onepower_meter_logs.log_timestamp IS 'When the reading was taken';

COMMENT ON COLUMN ops_data.onepower_meter_logs.sequence_number IS 'Sequential reading number';

COMMENT ON COLUMN ops_data.onepower_meter_logs.created_at IS 'Record creation time';

COMMENT ON TABLE ops_data.ps_events IS 'Power system events';

COMMENT ON COLUMN ops_data.ps_events.id IS 'Auto-generated';

COMMENT ON COLUMN ops_data.ps_events.power_system_id IS 'References power_systems.id';

COMMENT ON COLUMN ops_data.ps_events."timestamp" IS 'Event time';

COMMENT ON COLUMN ops_data.ps_events.event_type IS 'Event category';

COMMENT ON COLUMN ops_data.ps_events.severity IS '"info", "warning", "critical"';

COMMENT ON COLUMN ops_data.ps_events.description IS 'Human-readable description';

COMMENT ON COLUMN ops_data.ps_events.created_at IS 'Record creation time';

COMMENT ON TABLE ops_data.ps_logs IS 'Power system operational data';

COMMENT ON COLUMN ops_data.ps_logs.id IS 'Auto-generated';

COMMENT ON COLUMN ops_data.ps_logs.power_system_id IS 'References power_systems.id';

COMMENT ON COLUMN ops_data.ps_logs."timestamp" IS 'Reading time';

COMMENT ON COLUMN ops_data.ps_logs.battery_soc_percent IS 'Battery state of charge';

COMMENT ON COLUMN ops_data.ps_logs.battery_voltage_v IS 'Battery voltage';

COMMENT ON COLUMN ops_data.ps_logs.inverter_output_kw IS 'Current inverter output';

COMMENT ON COLUMN ops_data.ps_logs.solar_generation_kw IS 'Solar power generation';

COMMENT ON COLUMN ops_data.ps_logs.load_consumption_kw IS 'Current load';

COMMENT ON COLUMN ops_data.ps_logs.system_status IS '"normal", "warning", "error", etc.';

COMMENT ON COLUMN ops_data.ps_logs.data_quality IS 'Quality score (0.0-1.0)';

COMMENT ON COLUMN ops_data.ps_logs.created_at IS 'Record creation time';

COMMENT ON TABLE ops_data.sm_meter_events IS 'Meter event log';

COMMENT ON COLUMN ops_data.sm_meter_events.id IS 'Auto-generated';

COMMENT ON COLUMN ops_data.sm_meter_events.meter_id IS 'References sm_meters.id';

COMMENT ON COLUMN ops_data.sm_meter_events.event_timestamp IS 'When the event occurred';

COMMENT ON COLUMN ops_data.sm_meter_events.event_type IS 'ALARM, TAMPER, DISCONNECT, RECONNECT, etc.';

COMMENT ON COLUMN ops_data.sm_meter_events.event_code IS 'Provider specific event code';

COMMENT ON COLUMN ops_data.sm_meter_events.severity IS 'INFO, WARNING, CRITICAL';

COMMENT ON COLUMN ops_data.sm_meter_events.description IS 'Human-readable event description';

COMMENT ON COLUMN ops_data.sm_meter_events.event_data IS 'Additional event-specific data';

COMMENT ON COLUMN ops_data.sm_meter_events.raw_data IS 'Complete raw event from provider platform';

COMMENT ON COLUMN ops_data.sm_meter_events.created_at IS 'Record creation time';

COMMENT ON CONSTRAINT unq_sm_meter_logs ON ops_data.sm_meter_logs IS 'Prevent duplicate readings';

COMMENT ON TABLE ops_data.sm_meter_logs IS 'Meter log / readings time series data';

COMMENT ON COLUMN ops_data.sm_meter_logs.id IS 'Auto-generated';

COMMENT ON COLUMN ops_data.sm_meter_logs.meter_id IS 'References sm_meters.id';

COMMENT ON COLUMN ops_data.sm_meter_logs.log_timestamp IS 'When the reading was taken';

COMMENT ON COLUMN ops_data.sm_meter_logs.sequence_number IS 'Sequential reading number';

COMMENT ON COLUMN ops_data.sm_meter_logs.created_at IS 'Record creation time';

COMMENT ON TABLE ops_data.sparkmeter_meter_events IS 'Meter event log';

COMMENT ON COLUMN ops_data.sparkmeter_meter_events.id IS 'Auto-generated';

COMMENT ON COLUMN ops_data.sparkmeter_meter_events.meter_id IS 'References sm_meters.id';

COMMENT ON COLUMN ops_data.sparkmeter_meter_events.event_timestamp IS 'When the event occurred';

COMMENT ON COLUMN ops_data.sparkmeter_meter_events.event_type IS 'ALARM, TAMPER, DISCONNECT, RECONNECT, etc.';

COMMENT ON COLUMN ops_data.sparkmeter_meter_events.event_code IS 'Provider specific event code';

COMMENT ON COLUMN ops_data.sparkmeter_meter_events.severity IS 'INFO, WARNING, CRITICAL';

COMMENT ON COLUMN ops_data.sparkmeter_meter_events.description IS 'Human-readable event description';

COMMENT ON COLUMN ops_data.sparkmeter_meter_events.event_data IS 'Additional event-specific data';

COMMENT ON COLUMN ops_data.sparkmeter_meter_events.raw_data IS 'Complete raw event from provider platform';

COMMENT ON COLUMN ops_data.sparkmeter_meter_events.created_at IS 'Record creation time';

COMMENT ON CONSTRAINT unq_sm_meter_logs_0 ON ops_data.sparkmeter_meter_logs IS 'Prevent duplicate readings';

COMMENT ON TABLE ops_data.sparkmeter_meter_logs IS 'Meter log / readings time series data';

COMMENT ON COLUMN ops_data.sparkmeter_meter_logs.id IS 'Auto-generated';

COMMENT ON COLUMN ops_data.sparkmeter_meter_logs.meter_id IS 'References sm_meters.id';

COMMENT ON COLUMN ops_data.sparkmeter_meter_logs.log_timestamp IS 'When the reading was taken';

COMMENT ON COLUMN ops_data.sparkmeter_meter_logs.sequence_number IS 'Sequential reading number';

COMMENT ON COLUMN ops_data.sparkmeter_meter_logs.created_at IS 'Record creation time';

COMMENT ON TABLE payment_data.transactions IS 'Central table for all transactions across all meter platforms';

COMMENT ON COLUMN payment_data.transactions.id IS 'Auto-generated';

COMMENT ON COLUMN payment_data.transactions.transaction_reference IS 'Our internal reference';

COMMENT ON COLUMN payment_data.transactions.external_transaction_id IS 'External system''s transaction ID';

COMMENT ON COLUMN payment_data.transactions.customer_id IS 'References customers.id';

COMMENT ON COLUMN payment_data.transactions.meter_id IS 'ID from appropriate meter table';

COMMENT ON COLUMN payment_data.transactions.grid_id IS 'References grids.id';

COMMENT ON COLUMN payment_data.transactions.transaction_type IS 'topup, consumption, fee, refund, adjustment';

COMMENT ON COLUMN payment_data.transactions.amount IS 'Amount in local currency';

COMMENT ON COLUMN payment_data.transactions.currency_code IS 'Currency code';

COMMENT ON COLUMN payment_data.transactions.energy_purchased_kwh IS 'kWh purchased/topped up';

COMMENT ON COLUMN payment_data.transactions.tariff_rate IS 'Rate per kWh at transaction time';

COMMENT ON COLUMN payment_data.transactions.payment_method IS 'momo, cash, bank, agent, credit, rewards';

COMMENT ON COLUMN payment_data.transactions.payment_provider IS 'mpesa, mtn_momo, airtel_money, etc.';

COMMENT ON COLUMN payment_data.transactions.payment_reference IS 'External payment reference';

COMMENT ON COLUMN payment_data.transactions.status IS 'pending, completed, failed, cancelled, reversed';

COMMENT ON COLUMN payment_data.transactions.processed_at IS 'When transaction was processed';

COMMENT ON COLUMN payment_data.transactions.meter_provider IS 'References providers.id';

COMMENT ON COLUMN payment_data.transactions.platform_transaction_id IS 'ID from applicable meter provider';

COMMENT ON COLUMN payment_data.transactions.raw_transaction_data IS 'Original platform data';

COMMENT ON COLUMN payment_data.transactions.balance_before IS 'Customer balance before';

COMMENT ON COLUMN payment_data.transactions.balance_after IS 'Customer balance after';

COMMENT ON COLUMN payment_data.transactions.description IS 'Transaction description';

COMMENT ON COLUMN payment_data.transactions.notes IS 'Additional notes';

COMMENT ON COLUMN payment_data.transactions.created_at IS 'Record creation time';

COMMENT ON COLUMN payment_data.transactions.updated_at IS 'Last update time';

COMMENT ON TABLE payment_data.onepower_transactions IS 'Onepower specific transaction data';

COMMENT ON COLUMN payment_data.onepower_transactions.id IS 'Unique identifier';

COMMENT ON COLUMN payment_data.onepower_transactions.transaction_id IS 'References transactions.id';

COMMENT ON COLUMN payment_data.onepower_transactions.onepower_transaction_id IS 'Onepower''s transaction ID';

COMMENT ON COLUMN payment_data.onepower_transactions.meter_number IS 'Onepower meter identifier';

COMMENT ON COLUMN payment_data.onepower_transactions.credit_purchased IS 'Credit amount purchased';

COMMENT ON COLUMN payment_data.onepower_transactions.tariff_plan_id IS 'Onepower tariff plan reference';

COMMENT ON COLUMN payment_data.onepower_transactions.payment_channel IS 'Payment channel used';

COMMENT ON COLUMN payment_data.onepower_transactions.receipt_number IS 'Receipt number from Sparkmeter';

COMMENT ON COLUMN payment_data.onepower_transactions.onepower_raw_data IS 'Original onepower response';

COMMENT ON COLUMN payment_data.onepower_transactions.sync_status IS 'synced, pending, failed';

COMMENT ON COLUMN payment_data.onepower_transactions.created_at IS 'Record creation time';

COMMENT ON TABLE payment_data.sm_transactions IS 'Standard Microgrid specific transaction data';

COMMENT ON COLUMN payment_data.sm_transactions.id IS 'Unique identifier';

COMMENT ON COLUMN payment_data.sm_transactions.transaction_id IS 'References transactions.id';

COMMENT ON COLUMN payment_data.sm_transactions.sm_transaction_id IS 'Standard Microgrid''s transaction ID';

COMMENT ON COLUMN payment_data.sm_transactions.meter_number IS 'SM meter identifier';

COMMENT ON COLUMN payment_data.sm_transactions.credit_purchased IS 'Credit amount purchased';

COMMENT ON COLUMN payment_data.sm_transactions.payment_channel IS 'Payment channel used';

COMMENT ON COLUMN payment_data.sm_transactions.sync_status IS 'synced, pending, failed';

COMMENT ON COLUMN payment_data.sm_transactions.created_at IS 'Record creation time';

COMMENT ON TABLE payment_data.sparkmeter_transactions IS 'Sparkmeter specific transaction data';

COMMENT ON COLUMN payment_data.sparkmeter_transactions.id IS 'Unique identifier';

COMMENT ON COLUMN payment_data.sparkmeter_transactions.transaction_id IS 'References transactions.id';

COMMENT ON COLUMN payment_data.sparkmeter_transactions.sparkmeter_transaction_id IS 'Sparkmeter''s transaction ID';

COMMENT ON COLUMN payment_data.sparkmeter_transactions.meter_number IS 'Sparkmeter meter identifier';

COMMENT ON COLUMN payment_data.sparkmeter_transactions.credit_purchased IS 'Credit amount purchased';

COMMENT ON COLUMN payment_data.sparkmeter_transactions.tariff_plan_id IS 'Sparkmeter tariff plan reference';

COMMENT ON COLUMN payment_data.sparkmeter_transactions.payment_channel IS 'Payment channel used';

COMMENT ON COLUMN payment_data.sparkmeter_transactions.receipt_number IS 'Receipt number from Sparkmeter';

COMMENT ON COLUMN payment_data.sparkmeter_transactions.vendor_reference IS 'Vendor transaction reference';

COMMENT ON COLUMN payment_data.sparkmeter_transactions.sparkmeter_raw_data IS 'Original Sparkmeter response';

COMMENT ON COLUMN payment_data.sparkmeter_transactions.sync_status IS 'synced, pending, failed';

COMMENT ON COLUMN payment_data.sparkmeter_transactions.created_at IS 'Record creation time';

COMMENT ON TABLE payment_data.transaction_audit_log IS 'Track all changes to transaction records';

COMMENT ON COLUMN payment_data.transaction_audit_log.id IS 'Auto-generated';

COMMENT ON COLUMN payment_data.transaction_audit_log.transaction_id IS 'References transactions.id';

COMMENT ON COLUMN payment_data.transaction_audit_log."action" IS 'create, update, delete, status_change';

COMMENT ON COLUMN payment_data.transaction_audit_log.old_values IS 'Previous values';

COMMENT ON COLUMN payment_data.transaction_audit_log.new_values IS 'New values';

COMMENT ON COLUMN payment_data.transaction_audit_log.changed_by IS 'References user_profiles.id';

COMMENT ON COLUMN payment_data.transaction_audit_log.change_reason IS 'Reason for change';

COMMENT ON COLUMN payment_data.transaction_audit_log.ip_address IS 'IP address of user making change';

COMMENT ON COLUMN payment_data.transaction_audit_log.user_agent IS 'User agent string';

COMMENT ON COLUMN payment_data.transaction_audit_log.created_at IS 'When change occurred';

COMMENT ON TABLE payment_data.transaction_fees IS 'Track fees associated with transactions';

COMMENT ON COLUMN payment_data.transaction_fees.id IS 'Auto-generated';

COMMENT ON COLUMN payment_data.transaction_fees.transaction_id IS 'References transactions.id';

COMMENT ON COLUMN payment_data.transaction_fees.fee_type IS 'platform fee, payment fee, processing fee, agent commission, etc.';

COMMENT ON COLUMN payment_data.transaction_fees.fee_amount IS 'Fee amount';

COMMENT ON COLUMN payment_data.transaction_fees.fee_percentage IS 'Fee percentage if applicable';

COMMENT ON COLUMN payment_data.transaction_fees.charged_to IS 'customer, operator, platform, agent';

COMMENT ON COLUMN payment_data.transaction_fees.description IS 'Fee description';

COMMENT ON TABLE platforms.meter_providers IS 'List of metering platform providers';

COMMENT ON COLUMN platforms.meter_providers.id IS 'Auto-generated';

COMMENT ON COLUMN platforms.meter_providers.name IS 'Provider name (SM, Sparkmeter, OnePower, etc.)';

COMMENT ON COLUMN platforms.meter_providers.slug IS 'URL-friendly identifier';

COMMENT ON COLUMN platforms.meter_providers.description IS 'Provider description';

COMMENT ON COLUMN platforms.meter_providers.api_endpoint IS 'API base URL';

COMMENT ON COLUMN platforms.meter_providers.auth_method IS 'Authentication method';

COMMENT ON COLUMN platforms.meter_providers.documentation_url IS 'Link to API docs';

COMMENT ON COLUMN platforms.meter_providers.support_email IS 'Support contact';

COMMENT ON COLUMN platforms.meter_providers.schema_version IS 'API schema version';

COMMENT ON COLUMN platforms.meter_providers.is_active IS 'Whether provider is available';

COMMENT ON COLUMN platforms.meter_providers.created_at IS 'Auto timestamp';

COMMENT ON COLUMN platforms.meter_providers.updated_at IS 'Auto timestamp';

COMMENT ON TABLE platforms.momo_providers IS 'List of Momo providers';

COMMENT ON COLUMN platforms.momo_providers.id IS 'Auto-generated';

COMMENT ON COLUMN platforms.momo_providers.name IS 'Provider name (M-Pesa, MTN MoMo, Airtel Money, etc.)';

COMMENT ON COLUMN platforms.momo_providers.slug IS 'URL-friendly identifier';

COMMENT ON COLUMN platforms.momo_providers.region IS 'East Africa, West Africa, Francophone, Others';

COMMENT ON COLUMN platforms.momo_providers.country_codes IS 'Array of supported country codes';

COMMENT ON COLUMN platforms.momo_providers.description IS 'Provider description';

COMMENT ON COLUMN platforms.momo_providers.api_endpoint IS 'API base URL';

COMMENT ON COLUMN platforms.momo_providers.auth_method IS 'Authentication method description';

COMMENT ON COLUMN platforms.momo_providers.documentation_url IS 'Link to API docs';

COMMENT ON COLUMN platforms.momo_providers.support_email IS 'Support contact';

COMMENT ON COLUMN platforms.momo_providers.schema_version IS 'API schema version';

COMMENT ON COLUMN platforms.momo_providers.is_active IS 'Whether provider is available';

COMMENT ON COLUMN platforms.momo_providers.created_at IS 'Auto timestamp';

COMMENT ON COLUMN platforms.momo_providers.updated_at IS 'Auto timestamp';

COMMENT ON TABLE platforms.onepower_grid_configs IS 'Grid-Level Configuration';

COMMENT ON COLUMN platforms.onepower_grid_configs.id IS 'Auto-generated';

COMMENT ON COLUMN platforms.onepower_grid_configs.grid_id IS 'References grids.id';

COMMENT ON COLUMN platforms.onepower_grid_configs.is_active IS 'Whether OnePower is available on this grid';

COMMENT ON COLUMN platforms.onepower_grid_configs.created_at IS 'Auto timestamp';

COMMENT ON COLUMN platforms.onepower_grid_configs.updated_at IS 'Auto timestamp';

COMMENT ON TABLE platforms.onepower_meters IS 'Meter-Level Configuration';

COMMENT ON COLUMN platforms.onepower_meters.organization_id IS 'References organizations.id';

COMMENT ON COLUMN platforms.onepower_meters.branch_id IS 'References branches.id';

COMMENT ON COLUMN platforms.onepower_meters.grid_id IS 'References grids.id';

COMMENT ON COLUMN platforms.onepower_meters.customer_id IS 'References customers.id';

COMMENT ON COLUMN platforms.onepower_meters.serial_number IS 'Physical meter serial number';

COMMENT ON COLUMN platforms.onepower_meters.commissioning_date IS 'Date meter was commissioned';

COMMENT ON COLUMN platforms.onepower_meters.location IS 'Meter location';

COMMENT ON COLUMN platforms.onepower_meters.status IS 'enabled / disabled';

COMMENT ON COLUMN platforms.onepower_meters.last_reading_date IS 'Last successful data reading';

COMMENT ON COLUMN platforms.onepower_meters.notes IS 'Additional notes';

COMMENT ON COLUMN platforms.onepower_meters.created_at IS 'Auto timestamp';

COMMENT ON COLUMN platforms.onepower_meters.updated_at IS 'Auto timestamp';

COMMENT ON TABLE platforms.ps_providers IS 'List of power system monitoring providers';

COMMENT ON COLUMN platforms.ps_providers.provider_name IS 'Name of the monitoring system provider';

COMMENT ON COLUMN platforms.ps_providers.created_at IS 'Auto-generated';

COMMENT ON TABLE platforms.sm_grid_configs IS 'Grid-Level Configuration';

COMMENT ON COLUMN platforms.sm_grid_configs.id IS 'Auto-generated';

COMMENT ON COLUMN platforms.sm_grid_configs.grid_id IS 'References grids.id';

COMMENT ON COLUMN platforms.sm_grid_configs.is_active IS 'Whether SM is available on this grid';

COMMENT ON COLUMN platforms.sm_grid_configs.created_at IS 'Auto timestamp';

COMMENT ON COLUMN platforms.sm_grid_configs.updated_at IS 'Auto timestamp';

COMMENT ON TABLE platforms.sm_meters IS 'Meter-Level Configuration';

COMMENT ON COLUMN platforms.sm_meters.organization_id IS 'References organizations.id';

COMMENT ON COLUMN platforms.sm_meters.branch_id IS 'References branches.id';

COMMENT ON COLUMN platforms.sm_meters.grid_id IS 'References grids.id';

COMMENT ON COLUMN platforms.sm_meters.customer_id IS 'References customers.id';

COMMENT ON COLUMN platforms.sm_meters.serial_number IS 'Physical meter serial number';

COMMENT ON COLUMN platforms.sm_meters.commissioning_date IS 'Date meter was commissioned';

COMMENT ON COLUMN platforms.sm_meters.location IS 'Meter location';

COMMENT ON COLUMN platforms.sm_meters.sockets IS 'sockets assigned to this meter';

COMMENT ON COLUMN platforms.sm_meters.status IS 'enabled / disabled';

COMMENT ON COLUMN platforms.sm_meters.last_reading_date IS 'Last successful data reading';

COMMENT ON COLUMN platforms.sm_meters.notes IS 'Additional notes';

COMMENT ON COLUMN platforms.sm_meters.created_at IS 'Auto timestamp';

COMMENT ON COLUMN platforms.sm_meters.updated_at IS 'Auto timestamp';

COMMENT ON COLUMN platforms.sm_socket_templates.id IS 'Auto-generated';

COMMENT ON COLUMN platforms.sm_socket_templates.name IS 'Template name';

COMMENT ON COLUMN platforms.sm_socket_templates.description IS 'Template description';

COMMENT ON COLUMN platforms.sm_socket_templates.config IS 'socket configuration';

COMMENT ON COLUMN platforms.sm_socket_templates.is_active IS 'Whether template is available';

COMMENT ON COLUMN platforms.sm_socket_templates.created_at IS 'Auto timestamp';

COMMENT ON COLUMN platforms.sm_socket_templates.updated_at IS 'Auto timestamp';

COMMENT ON TABLE platforms.sm_sockets IS 'SM Socket Configurations';

COMMENT ON COLUMN platforms.sm_sockets.id IS 'Auto-generated';

COMMENT ON COLUMN platforms.sm_sockets.meter_id IS 'References sm_meters.id';

COMMENT ON COLUMN platforms.sm_sockets.socket_number IS 'Socket number (1-5)';

COMMENT ON COLUMN platforms.sm_sockets.socket_template_id IS 'References sm_socket_templates.id';

COMMENT ON COLUMN platforms.sm_sockets.socket_config IS 'Current socket configuration';

COMMENT ON COLUMN platforms.sm_sockets.status IS 'enabled / disabled';

COMMENT ON COLUMN platforms.sm_sockets.last_reading_date IS 'Last successful socket reading';

COMMENT ON COLUMN platforms.sm_sockets.notes IS 'Socket-specific notes';

COMMENT ON COLUMN platforms.sm_sockets.created_at IS 'Auto timestamp';

COMMENT ON COLUMN platforms.sm_sockets.updated_at IS 'Auto timestamp';

COMMENT ON TABLE platforms.sparkmeter_grid_configs IS 'Grid-Level Configuration';

COMMENT ON COLUMN platforms.sparkmeter_grid_configs.id IS 'Auto-generated';

COMMENT ON COLUMN platforms.sparkmeter_grid_configs.grid_id IS 'References grids.id';

COMMENT ON COLUMN platforms.sparkmeter_grid_configs.is_active IS 'Whether Sparkmeter is available on this grid';

COMMENT ON COLUMN platforms.sparkmeter_grid_configs.created_at IS 'Auto timestamp';

COMMENT ON COLUMN platforms.sparkmeter_grid_configs.updated_at IS 'Auto timestamp';

COMMENT ON TABLE platforms.sparkmeter_meters IS 'Meter-Level Configuration';

COMMENT ON COLUMN platforms.sparkmeter_meters.organization_id IS 'References organizations.id';

COMMENT ON COLUMN platforms.sparkmeter_meters.branch_id IS 'References branches.id';

COMMENT ON COLUMN platforms.sparkmeter_meters.grid_id IS 'References grids.id';

COMMENT ON COLUMN platforms.sparkmeter_meters.customer_id IS 'References customers.id';

COMMENT ON COLUMN platforms.sparkmeter_meters.serial_number IS 'Physical meter serial number';

COMMENT ON COLUMN platforms.sparkmeter_meters.commissioning_date IS 'Date meter was commissioned';

COMMENT ON COLUMN platforms.sparkmeter_meters.location IS 'Meter location';

COMMENT ON COLUMN platforms.sparkmeter_meters.status IS 'enabled / disabled';

COMMENT ON COLUMN platforms.sparkmeter_meters.last_reading_date IS 'Last successful data reading';

COMMENT ON COLUMN platforms.sparkmeter_meters.notes IS 'Additional notes';

COMMENT ON COLUMN platforms.sparkmeter_meters.created_at IS 'Auto timestamp';

COMMENT ON COLUMN platforms.sparkmeter_meters.updated_at IS 'Auto timestamp';

COMMENT ON TABLE platforms.momo_grid_configs IS 'Grid specific Momo configuration settings';

COMMENT ON COLUMN platforms.momo_grid_configs.grid_id IS 'References grids.id';

COMMENT ON COLUMN platforms.momo_grid_configs.provider_id IS 'References momo_providers.id';

COMMENT ON COLUMN platforms.momo_grid_configs.operator_phone_number IS 'Grid operator''s mobile money number';

COMMENT ON COLUMN platforms.momo_grid_configs.operator_account_name IS 'Account holder name';

COMMENT ON COLUMN platforms.momo_grid_configs.operator_account_reference IS 'Additional account reference';

COMMENT ON COLUMN platforms.momo_grid_configs.merchant_identifier IS 'Merchant ID, Client ID, Biller Code';

COMMENT ON COLUMN platforms.momo_grid_configs.api_key IS 'API Key, Subscription Key';

COMMENT ON COLUMN platforms.momo_grid_configs.api_secret IS 'Client Secret, Password, Passkey';

COMMENT ON COLUMN platforms.momo_grid_configs.secondary_id IS 'User ID, Paybill Number, Service Code';

COMMENT ON COLUMN platforms.momo_grid_configs.pin_or_code IS 'PIN, Shortcode, Account Number';

COMMENT ON COLUMN platforms.momo_grid_configs.callback_url IS 'Payment callback URL';

COMMENT ON COLUMN platforms.momo_grid_configs.timeout_url IS 'Payment timeout URL';

COMMENT ON COLUMN platforms.momo_grid_configs.environment IS 'sandbox, production';

COMMENT ON COLUMN platforms.momo_grid_configs.provider_config IS 'Provider-specific additional configs';

COMMENT ON COLUMN platforms.momo_grid_configs.is_active IS 'Whether provider is available on this grid';

COMMENT ON COLUMN platforms.momo_grid_configs.created_at IS 'Auto timestamp';

COMMENT ON COLUMN platforms.momo_grid_configs.updated_at IS 'Auto timestamp';

