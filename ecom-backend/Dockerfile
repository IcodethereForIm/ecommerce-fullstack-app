FROM php:8.4-fpm

# System dependencies
RUN apt-get update && apt-get install -y \
    git curl unzip libzip-dev

# PHP extensions
RUN docker-php-ext-install pdo pdo_mysql zip

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy project
COPY . .

# Install dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Permissions (important for Laravel)
RUN chmod -R 775 storage bootstrap/cache

# Expose Railway port
EXPOSE 10000

# Start PHP built-in server pointing to public folder
CMD php artisan storage:link || true && php -S 0.0.0.0:10000 -t public