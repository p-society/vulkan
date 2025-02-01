import { assignFilters, FILTERS, rawQuery } from '../common/query.utils';
import options from '../common/options';
import { nestify } from '../common/nestify';

export class Service {
    #model;
    #options;
    constructor(model, options) {
        this.model = model;
        this.options = options || {
            multi: false,
            softDelete: false,
        };
    }

    async _find(
        query = {},
        findOptions = {
            handleSoftDelete: true,
        },
    ) {
        if (!findOptions.handleSoftDelete) {
            throw new BadRequestException(
                'findOptions.handleSoftDelete not provided in _find.',
            );
        }
        query[options.deleteKey || 'deleted'] = {
            $ne: true,
        };

        const filters = assignFilters({}, query, FILTERS, {});
        const searchQuery = rawQuery(query);
        const isPaginationDisabled =
            query.$paginate === false || query.$paginate === 'false';

        const q = this.model.find(searchQuery);
        nestify(q, filters, options, isPaginationDisabled);
        if (isPaginationDisabled) {
            return (await q.exec());
        }

        const [data, total] = await Promise.all([
            q.exec(),
            this.model.countDocuments({
                [options.deleteKey || 'deleted']: { $ne: true },
                ...searchQuery,
            }),
        ]);

        return {
            total,
            $limit: Number(filters.$limit) || options.defaultLimit,
            $skip: Number(filters.$skip) || options.defaultSkip,
            data,
        };
    }

    async _create(
        data,
        needsMulti
    ) {
        const multi = needsMulti !== undefined ? needsMulti : options.multi;

        if (multi) {
            if (!Array.isArray(data)) {
                throw new BadRequestException(
                    'Bulk creation requires an array of key value pairs.',
                );
            }
            return this.model.insertMany(data, { ordered: false });
        }
        if (Array.isArray(data)) {
            throw new BadRequestException(
                'Single creation expects a single user object, not an array.',
            );
        }
        return this.model.create(data);
    }

    async _patch(
        id,
        data,
        query = {},
        patchOptions = {
            handleSoftDelete: true,
        },
    ) {
        if (!patchOptions.handleSoftDelete) {
            throw new BadRequestException(
                'patchOptions.handleSoftDelete not provided in _patch.',
            );
        }
        query[options.deleteKey || 'deleted'] = {
            $ne: true,
        };

        const filters = assignFilters({}, query, FILTERS, {});
        const searchQuery = id
            ? { _id: id, ...rawQuery(query) }
            : rawQuery(query);

        const isSingleUpdate = Boolean(id);
        const q = this._getOrFind(isSingleUpdate, searchQuery, data);

        if (isSingleUpdate) {
            nestify(q, filters, options, isSingleUpdate);
            return q.exec();
        }
        const result = await q.exec();

        if (result.modifiedCount > 0) {
            return this.model.find(searchQuery).exec();
        }
        return [];
    }

    async _get(
        id,
        query = {},
        getOptions = {
            handleSoftDelete: true,
        },
    ) {
        if (!getOptions.handleSoftDelete) {
            throw new BadRequestException(
                'getOptions.handleSoftDelete not provided in _get.',
            );
        }

        query[options.deleteKey || 'deleted'] = {
            $ne: true,
        };

        const filters = assignFilters({}, query, FILTERS, {});
        const searchQuery = {
            ...rawQuery(query),
            _id: id,
        };

        const q = this.model.findOne(searchQuery);
        const isSingleOperation = true;
        nestify(q, filters, options, isSingleOperation);
        // @ts-expect-error
        return (await q.exec()) || [];
    }

    #_getOrFind(
        isSingleUpdate,
        searchQuery,
        data,
    ) {
        if (isSingleUpdate) {
            return this.model.findOneAndUpdate(searchQuery, data, { new: true });
        }
        return this.model.updateMany(searchQuery, data);
    }

    async _remove(
        id,
        query = {},
        user,
        removeOptions = {
            handleSoftDelete: true,
        },
    ) {
        if (!removeOptions.handleSoftDelete) {
            throw new BadRequestException(
                'removeOptions.handleSoftDelete not provided in _remove.',
            );
        }
        const searchQuery = id
            ? { _id: id, ...rawQuery(query) }
            : rawQuery(query);

        const data = await this._get(id, query);

        if (removeOptions.handleSoftDelete) {
            await this._patch(
                id,
                {
                    deleted: true,
                    deletedBy: user._id,
                    deletedAt: new Date(),
                },
                searchQuery,
            );
            return data;
        }
        if (id) {
            await this.model.deleteOne(searchQuery).exec()
        } else {
            await this.model.deleteMany(searchQuery).exec();
        }
        return data;
    }

    async getCount(filter) {
        return this.model.countDocuments(filter);
    }
}