%% PIPE SUPPORT STRUCTURAL DESIGN CALCULATIONS
% Design per CSA S16-19 (Steel Structures) and CSA S6 standards
% Author: Structural Design Calculator
% Date: 2025-10-31

clear all;
clc;
format long;

fprintf('========================================\n');
fprintf('PIPE SUPPORT STRUCTURAL DESIGN\n');
fprintf('CSA Standards Compliance Check\n');
fprintf('========================================\n\n');

%% MATERIAL PROPERTIES
% Steel Grade: ASTM A500 Grade C (typical for hollow structural sections)
Fy = 345;           % Yield strength (MPa)
Fu = 448;           % Ultimate tensile strength (MPa)
E = 200000;         % Modulus of elasticity (MPa)
rho_steel = 7850;   % Density of steel (kg/m?)
rho_water = 1000;   % Density of water (kg/m?)
g = 9.81;           % Gravitational acceleration (m/s?)

% Safety factors per CSA S16-19
phi = 0.90;         % Resistance factor for steel (CSA S16 Cl. 13.5)
phi_b = 0.90;       % Resistance factor for bending
phi_w = 0.67;       % Resistance factor for welds (CSA W59)
phi_a = 0.75;       % Resistance factor for anchors (CSA A23.3)

fprintf('=== MATERIAL PROPERTIES ===\n');
fprintf('Steel Grade: ASTM A500 Grade C\n');
fprintf('Yield Strength (Fy): %.0f MPa\n', Fy);
fprintf('Ultimate Strength (Fu): %.0f MPa\n', Fu);
fprintf('Modulus of Elasticity (E): %.0f MPa\n\n', E);

%% GEOMETRIC PROPERTIES

% Square tube section: 3" x 3" x 0.25"
% Convert to mm
tube_outer = 3 * 25.4;        % Outer dimension (mm)
tube_thickness = 0.25 * 25.4; % Wall thickness (mm)
tube_inner = tube_outer - 2*tube_thickness;

% Section properties for square HSS
A_tube = tube_outer^2 - tube_inner^2;  % Cross-sectional area (mm?)
I_tube = (tube_outer^4 - tube_inner^4)/12;  % Moment of inertia (mm?)
S_tube = I_tube / (tube_outer/2);      % Section modulus (mm?)
Z_tube = (tube_outer^3 - tube_inner^3)/6;  % Plastic section modulus (mm?)
r_tube = sqrt(I_tube/A_tube);          % Radius of gyration (mm)

% Cantilever dimensions
L_cantilever = 200;           % Cantilever length (mm)
H_post = 885;                 % Post height (mm)

% Plate dimensions
plate_length = 230;           % Plate length (mm)
plate_width = 100;            % Plate width (mm)
plate_thickness = 6;          % Plate thickness (mm)

% Base plate dimensions
base_length = 8 * 25.4;       % Base plate length (mm)
base_width = 8 * 25.4;        % Base plate width (mm)
base_thickness = 0.25 * 25.4; % Base plate thickness (mm)

% Weld dimensions
weld_size = 6;                % Fillet weld size (mm)

% Anchor bolts
anchor_diameter = 0.5 * 25.4; % Anchor diameter (mm)
n_anchors = 4;                % Number of anchors
anchor_spacing = base_length - 25.4;  % Typical edge distance

fprintf('=== GEOMETRIC PROPERTIES ===\n');
fprintf('Square Tube (HSS): %.1f x %.1f x %.1f mm\n', tube_outer, tube_outer, tube_thickness);
fprintf('Cross-sectional area: %.2f mm?\n', A_tube);
fprintf('Moment of inertia: %.2f mm?\n', I_tube);
fprintf('Section modulus: %.2f mm?\n', S_tube);
fprintf('Plastic section modulus: %.2f mm?\n', Z_tube);
fprintf('Cantilever length: %.0f mm\n', L_cantilever);
fprintf('Post height: %.0f mm\n\n', H_post);

%% PIPE PROPERTIES AND LOADING

% 12" SCH 10 Stainless Steel 340L pipe properties
pipe_OD = 12.75 * 25.4;       % Outer diameter (mm) - 12" nominal
pipe_thickness = 0.25 * 25.4; % Wall thickness (mm) - SCH 10
pipe_ID = pipe_OD - 2*pipe_thickness;  % Inner diameter (mm)
pipe_length = 3000;           % Pipe length (mm)
rho_ss = 7900;                % Density of stainless steel 340L (kg/m?)

% Pipe cross-sectional area
A_pipe = pi/4 * (pipe_OD^2 - pipe_ID^2);  % mm?

% Volume calculations
V_steel_pipe = A_pipe * pipe_length / 1e9;  % m?
V_water = pi/4 * pipe_ID^2 * pipe_length / 1e9;  % m?

% Weight calculations
W_pipe = V_steel_pipe * rho_ss * g;     % Weight of pipe (N)
W_water = V_water * rho_water * g;      % Weight of water (N)
W_total = W_pipe + W_water;             % Total weight (N)

% Load factor for dead load per CSA S16 (factored load)
alpha_D = 1.25;                         % Dead load factor
W_factored = alpha_D * W_total;         % Factored load (N)

fprintf('=== PIPE LOADING ANALYSIS ===\n');
fprintf('Pipe: 12" SCH 10 Stainless Steel 340L\n');
fprintf('Pipe OD: %.2f mm\n', pipe_OD);
fprintf('Pipe ID: %.2f mm\n', pipe_ID);
fprintf('Pipe Length: %.0f mm (%.2f m)\n', pipe_length, pipe_length/1000);
fprintf('Pipe Weight: %.2f N (%.2f kg)\n', W_pipe, W_pipe/g);
fprintf('Water Weight: %.2f N (%.2f kg)\n', W_water, W_water/g);
fprintf('Total Unfactored Load: %.2f N (%.2f kg)\n', W_total, W_total/g);
fprintf('Total Factored Load: %.2f N (%.2f kg)\n\n', W_factored, W_factored/g);

%% CANTILEVER BENDING ANALYSIS

% Moment at the cantilever support (at tube connection)
M_cantilever = W_factored * L_cantilever / 1000;  % N?m
M_cantilever_Nmm = M_cantilever * 1000;           % N?mm

% Bending stress (elastic analysis)
f_b = M_cantilever_Nmm / S_tube;  % MPa

% Bending moment resistance (CSA S16 Cl. 13.5)
% For Class 1 or 2 sections, Mr = phi_b * Z * Fy
% For Class 3 sections, Mr = phi_b * S * Fy
% Assuming Class 1/2 section for square HSS
M_r = phi_b * Z_tube * Fy / 1000;  % kN?m

% Unity check for bending
UC_bending = M_cantilever / M_r;

fprintf('=== CANTILEVER BENDING ANALYSIS ===\n');
fprintf('Bending Moment: %.2f N?m (%.2f kN?m)\n', M_cantilever, M_cantilever/1000);
fprintf('Bending Stress: %.2f MPa\n', f_b);
fprintf('Moment Resistance (Mr): %.2f kN?m\n', M_r);
fprintf('Unity Check (M/Mr): %.3f ', UC_bending);
if UC_bending <= 1.0
    fprintf('? PASS\n\n');
else
    fprintf('? FAIL\n\n');
end

%% SHEAR ANALYSIS IN CANTILEVER

% Shear force at support
V_cantilever = W_factored;  % N

% Shear resistance per CSA S16 Cl. 13.4.1
% For HSS sections, Vr = phi * 0.66 * Fy * Aw
% Aw = 2 * tube_outer * tube_thickness (for square HSS, two webs)
A_w = 2 * tube_outer * tube_thickness;  % mm?
V_r = phi * 0.66 * Fy * A_w / 1000;     % kN

UC_shear = (V_cantilever/1000) / V_r;

fprintf('=== SHEAR ANALYSIS ===\n');
fprintf('Shear Force: %.2f N (%.2f kN)\n', V_cantilever, V_cantilever/1000);
fprintf('Shear Resistance (Vr): %.2f kN\n', V_r);
fprintf('Unity Check (V/Vr): %.3f ', UC_shear);
if UC_shear <= 1.0
    fprintf('? PASS\n\n');
else
    fprintf('? FAIL\n\n');
end

%% WELD ANALYSIS (Plate to Cantilever)

% Fillet weld connecting plate to horizontal tube
% Weld is subjected to shear and moment

% Effective weld throat
a_w = weld_size / sqrt(2);  % Effective throat thickness (mm)

% Weld length - assuming weld around perimeter of plate contact
L_weld = 2 * plate_length + 2 * plate_width;  % mm (perimeter)

% Weld section properties
A_weld = a_w * L_weld;  % Effective area (mm?)

% For moment about weld group, calculate section modulus
% Treating weld as rectangular pattern
I_weld_x = (2 * a_w * plate_length^3 / 12) + (2 * a_w * plate_width * (plate_length/2)^2);
I_weld_y = (2 * a_w * plate_width^3 / 12) + (2 * a_w * plate_length * (plate_width/2)^2);
S_weld = I_weld_x / (plate_length/2);  % Section modulus about critical axis

% Shear stress in weld due to direct load
tau_direct = V_cantilever / A_weld;  % MPa

% Shear stress due to moment
tau_moment = M_cantilever_Nmm / S_weld;  % MPa

% Combined stress
tau_weld = sqrt(tau_direct^2 + tau_moment^2);  % MPa

% Weld resistance per CSA W59
% For E480XX electrodes, Xu = 480 MPa
Xu = 480;  % Electrode strength (MPa)
V_weld_r = phi_w * 0.67 * Xu * A_weld / 1000;  % kN

UC_weld = tau_weld / (phi_w * 0.67 * Xu);

fprintf('=== WELD STRESS ANALYSIS ===\n');
fprintf('Weld Size: %d mm fillet\n', weld_size);
fprintf('Effective Throat: %.2f mm\n', a_w);
fprintf('Weld Length: %.0f mm\n', L_weld);
fprintf('Direct Shear Stress: %.2f MPa\n', tau_direct);
fprintf('Moment Shear Stress: %.2f MPa\n', tau_moment);
fprintf('Combined Stress: %.2f MPa\n', tau_weld);
fprintf('Allowable Stress: %.2f MPa\n', phi_w * 0.67 * Xu);
fprintf('Unity Check: %.3f ', UC_weld);
if UC_weld <= 1.0
    fprintf('? PASS\n\n');
else
    fprintf('? FAIL\n\n');
end

%% POST ANALYSIS (Axial + Bending)

% The vertical post experiences:
% 1. Axial compression from the load
% 2. Bending moment at the base from cantilever

% Axial compression
P_f = W_factored;  % N

% Compressive resistance per CSA S16
% Assuming pinned-pinned condition (conservative)
K = 1.0;           % Effective length factor
L_e = K * H_post;  % Effective length (mm)
lambda = L_e / r_tube;  % Slenderness ratio

% Column strength per CSA S16 Cl. 13.3.1
% Simplified approach for slenderness
Fe = pi^2 * E / lambda^2;  % Elastic buckling stress (MPa)

if lambda <= (25 * sqrt(E/Fy))
    Cr = phi * A_tube * (1 + lambda^(2*1.34))^(-1/1.34) * Fy / 1000;  % kN
else
    Cr = phi * A_tube * Fe / 1000;  % kN
end

UC_compression = (P_f/1000) / Cr;

% Bending moment at post base
M_base = M_cantilever + W_factored * (tube_outer/2)/1000;  % N?m (approx)
M_base_Nmm = M_base * 1000;

f_b_post = M_base_Nmm / S_tube;  % MPa

% Combined stress check per CSA S16 Cl. 13.8
% Interaction equation: P/Pr + 0.85*M/Mr <= 1.0
UC_combined = (P_f/1000)/Cr + 0.85*(M_base)/M_r;

fprintf('=== VERTICAL POST ANALYSIS ===\n');
fprintf('Post Height: %.0f mm\n', H_post);
fprintf('Slenderness Ratio: %.2f\n', lambda);
fprintf('Axial Compression: %.2f kN\n', P_f/1000);
fprintf('Compressive Resistance (Cr): %.2f kN\n', Cr);
fprintf('Compression Unity Check: %.3f ', UC_compression);
if UC_compression <= 1.0
    fprintf('? PASS\n');
else
    fprintf('? FAIL\n');
end
fprintf('Moment at Base: %.2f N?m\n', M_base);
fprintf('Combined Unity Check: %.3f ', UC_combined);
if UC_combined <= 1.0
    fprintf('? PASS\n\n');
else
    fprintf('? FAIL\n\n');
end

%% ANCHOR BOLT ANALYSIS

% Base plate subjected to:
% 1. Axial load (tension/compression)
% 2. Moment from cantilever

% Assuming moment creates tension on one side
% Bolt spacing and geometry
bolt_circle = anchor_spacing;  % Distance between bolt centers

% Tension per bolt due to moment (using elastic analysis)
% T_bolt = M * c / (n * A_bolt * d)
% where c is distance to extreme bolt, n is number of bolts in tension

% Conservative: assume 2 bolts in tension
n_tension = 2;
c = bolt_circle / 2;  % Distance to extreme bolt

% Moment at base plate
M_bp = M_base + P_f * (tube_outer/2 + base_thickness) / 1000;  % N?m

% Tension per bolt
T_bolt = M_bp * 1000 * c / (n_tension * bolt_circle);  % N

% Add compression load distributed over all bolts
P_bolt = P_f / n_anchors;  % N per bolt

% Net tension (if applicable)
T_net = max(T_bolt - P_bolt, 0);  % N

% Bolt tensile area (for 1/2" bolt)
A_bolt = pi/4 * anchor_diameter^2;  % mm?

% Tensile stress in bolt
f_t_bolt = T_net / A_bolt;  % MPa

% Bolt capacity for Hilti drop-in anchors (typical)
% For 1/2" drop-in in 3000 psi concrete
T_bolt_capacity = 8.5 * 1000;  % N (typical value, consult Hilti specs)

% Resistance factor applied
T_bolt_r = phi_a * T_bolt_capacity;  % N

UC_bolt = T_net / T_bolt_r;

fprintf('=== ANCHOR BOLT ANALYSIS ===\n');
fprintf('Anchor Type: Hilti 1/2" Drop-in Anchors\n');
fprintf('Number of Anchors: %d\n', n_anchors);
fprintf('Moment at Base Plate: %.2f N?m\n', M_bp);
fprintf('Tension per Bolt (from moment): %.2f N\n', T_bolt);
fprintf('Compression per Bolt: %.2f N\n', P_bolt);
fprintf('Net Tension per Bolt: %.2f N\n', T_net);
fprintf('Bolt Tensile Stress: %.2f MPa\n', f_t_bolt);
fprintf('Bolt Tension Capacity: %.2f N (factored: %.2f N)\n', T_bolt_capacity, T_bolt_r);
fprintf('Unity Check: %.3f ', UC_bolt);
if UC_bolt <= 1.0
    fprintf('? PASS\n\n');
else
    fprintf('? FAIL\n\n');
end

%% BASE PLATE BENDING ANALYSIS

% Base plate bending between anchor bolts
% Using yield line analysis or simplified approach

% Maximum moment in base plate (conservative)
% Assuming cantilever from tube edge to bolt
overhang = (base_length - tube_outer) / 2;  % mm

% Bearing stress under tube
sigma_bearing = P_f / A_tube;  % MPa

% Plate bending moment per unit width
m_plate = sigma_bearing * A_tube / (base_length * base_width) * overhang^2 / 2;  % N?mm/mm

% Plate section modulus per unit width
S_plate = base_thickness^2 / 6;  % mm?/mm

% Bending stress in plate
f_plate = m_plate / S_plate;  % MPa

% Allowable stress
f_allow_plate = phi * Fy;  % MPa

UC_base_plate = f_plate / f_allow_plate;

fprintf('=== BASE PLATE ANALYSIS ===\n');
fprintf('Base Plate: %.0f x %.0f x %.1f mm\n', base_length, base_width, base_thickness);
fprintf('Plate Bending Stress: %.2f MPa\n', f_plate);
fprintf('Allowable Stress: %.2f MPa\n', f_allow_plate);
fprintf('Unity Check: %.3f ', UC_base_plate);
if UC_base_plate <= 1.0
    fprintf('? PASS\n\n');
else
    fprintf('? FAIL\n\n');
end

%% DEFLECTION CHECK

% Cantilever deflection at free end
% delta = (W * L^3) / (3 * E * I)
delta = (W_factored * L_cantilever^3) / (3 * E * I_tube);  % mm

% Allowable deflection (typical: L/360 for dead load)
delta_allow = L_cantilever / 360;  % mm

UC_deflection = delta / delta_allow;

fprintf('=== DEFLECTION ANALYSIS ===\n');
fprintf('Cantilever Deflection: %.3f mm\n', delta);
fprintf('Allowable Deflection (L/360): %.3f mm\n', delta_allow);
fprintf('Unity Check: %.3f ', UC_deflection);
if UC_deflection <= 1.0
    fprintf('? PASS\n\n');
else
    fprintf('? FAIL\n\n');
end

%% SUMMARY OF RESULTS

fprintf('========================================\n');
fprintf('DESIGN SUMMARY - CSA COMPLIANCE\n');
fprintf('========================================\n\n');

components = {
    'Cantilever Bending', UC_bending;
    'Cantilever Shear', UC_shear;
    'Weld Connection', UC_weld;
    'Post Compression', UC_compression;
    'Post Combined Stress', UC_combined;
    'Anchor Bolts', UC_bolt;
    'Base Plate', UC_base_plate;
    'Deflection', UC_deflection;
};

fprintf('Component                    Unity Check   Status\n');
fprintf('------------------------------------------------\n');
for i = 1:size(components, 1)
    status = '? PASS';
    if components{i, 2} > 1.0
        status = '? FAIL';
    end
    fprintf('%-25s    %.3f      %s\n', components{i, 1}, components{i, 2}, status);
end

fprintf('\n========================================\n');
fprintf('DESIGN RECOMMENDATIONS\n');
fprintf('========================================\n\n');

all_pass = true;
for i = 1:size(components, 1)
    if components{i, 2} > 1.0
        all_pass = false;
        break;
    end
end

if all_pass
    fprintf('? All components meet CSA design requirements.\n');
    fprintf('? The pipe support system is adequate for the specified loading.\n');
else
    fprintf('? Some components exceed allowable limits.\n');
    fprintf('  Recommendations:\n');
    if UC_bending > 1.0 || UC_shear > 1.0
        fprintf('  - Increase cantilever tube size or reduce cantilever length\n');
    end
    if UC_weld > 1.0
        fprintf('  - Increase weld size or use full penetration weld\n');
    end
    if UC_compression > 1.0 || UC_combined > 1.0
        fprintf('  - Increase post tube size or reduce post height\n');
    end
    if UC_bolt > 1.0
        fprintf('  - Use larger diameter anchors or increase number of anchors\n');
    end
    if UC_base_plate > 1.0
        fprintf('  - Increase base plate thickness\n');
    end
    if UC_deflection > 1.0
        fprintf('  - Increase cantilever tube size to reduce deflection\n');
    end
end

fprintf('\n========================================\n');
fprintf('NOTES:\n');
fprintf('========================================\n');
fprintf('1. Calculations performed per CSA S16-19\n');
fprintf('2. Load factors per CSA S16 (Dead Load: 1.25)\n');
fprintf('3. Material: ASTM A500 Grade C structural steel\n');
fprintf('4. Weld design per CSA W59\n');
fprintf('5. Anchor design assumes 3000 psi concrete minimum\n');
fprintf('6. Verify actual anchor capacity with Hilti specifications\n');
fprintf('7. All dimensions and loads should be verified on site\n');
fprintf('8. Professional engineer review required for final design\n');
fprintf('========================================\n\n');

%% PLOT RESULTS (Optional Visualization)

% Create a summary bar chart of unity checks
figure('Name', 'Structural Design Unity Checks', 'Position', [100 100 800 600]);
component_names = categorical(components(:,1));
component_names = reordercats(component_names, components(:,1));
unity_checks = cell2mat(components(:,2));

bar(component_names, unity_checks);
hold on;
yline(1.0, 'r--', 'LineWidth', 2, 'Label', 'Unity Limit (1.0)');
ylabel('Unity Check (Demand/Capacity)');
xlabel('Component');
title('CSA Design Compliance - Unity Checks');
grid on;
ylim([0 max(1.2, max(unity_checks)*1.1)]);

% Color code the bars
colors = repmat([0.2 0.7 0.2], length(unity_checks), 1);  % Green
for i = 1:length(unity_checks)
    if unity_checks(i) > 1.0
        colors(i,:) = [0.8 0.2 0.2];  % Red for failures
    end
end

b = bar(component_names, unity_checks);
b.FaceColor = 'flat';
b.CData = colors;

hold off;

fprintf('Program completed successfully.\n');
fprintf('Review results above for design adequacy.\n');
