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

# Permissions
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 10000

# IMPORTANT: proper Laravel runtime
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=10000"]