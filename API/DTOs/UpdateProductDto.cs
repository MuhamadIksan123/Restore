using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class UpdateProductDto
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;
        [Required]
        [Range(100, double.PositiveInfinity)]
        public long Price { get; set; }
        public IFormFile? File { get; set; }
        [Required]
        public string Brand { get; set; } = string.Empty;
        [Required]
        public string Type { get; set; } = string.Empty;
        [Required]
        [Range(0, 200)]
        public int QuantityInStock { get; set; }
    }
}