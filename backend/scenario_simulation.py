def simulate_scenario(input_data, reduction_factor):

    simulated_data = input_data.copy()

    for key in simulated_data:
        simulated_data[key] = simulated_data[key] * (1 - reduction_factor)

    return simulated_data
