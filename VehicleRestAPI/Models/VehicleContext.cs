﻿using System;
using Microsoft.EntityFrameworkCore;

namespace VehicleRestAPI.Models
{
    public class VehicleContext : DbContext
    {
        public VehicleContext(DbContextOptions<VehicleContext> options): base(options)
        {
        }

        public DbSet<Vehicle> Vehicles { get; set; } 
    }
}
