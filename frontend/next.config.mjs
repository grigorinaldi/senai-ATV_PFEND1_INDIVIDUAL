
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/produtos",
        destination: "http://localhost:3001/produtos"
      },
      {
        source: "/api/produtos/:id",
        destination: "http://localhost:3001/produtos/:id"
      }
    ];
  }
};

export default nextConfig;
